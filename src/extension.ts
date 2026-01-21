import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel;

function getCommonCookPaths(): string[] {
    const home = os.homedir();
    const paths = [
        path.join(home, '.cargo', 'bin', 'cook'),
        path.join(home, '.local', 'bin', 'cook'),
        '/usr/local/bin/cook',
        '/opt/homebrew/bin/cook',
        '/usr/bin/cook',
    ];

    if (process.platform === 'win32') {
        paths.unshift(
            path.join(home, '.cargo', 'bin', 'cook.exe'),
            path.join(process.env.LOCALAPPDATA || '', 'Programs', 'cook', 'cook.exe'),
        );
    }

    return paths;
}

function findCookExecutable(configuredPath: string): string | null {
    if (configuredPath !== 'cook') {
        if (fs.existsSync(configuredPath)) {
            return configuredPath;
        }
        return null;
    }

    for (const p of getCommonCookPaths()) {
        if (fs.existsSync(p)) {
            return p;
        }
    }

    return 'cook';
}

async function showCookNotFoundError(configuredPath: string): Promise<void> {
    const message = configuredPath === 'cook'
        ? 'Could not find the "cook" CLI. The Cooklang language server requires it to be installed.'
        : `Could not find cook executable at "${configuredPath}".`;

    const installOption = 'Install cook CLI';
    const configOption = 'Configure Path';

    const choice = await vscode.window.showErrorMessage(
        message,
        installOption,
        configOption
    );

    if (choice === installOption) {
        vscode.env.openExternal(vscode.Uri.parse('https://cooklang.org/cli/'));
    } else if (choice === configOption) {
        vscode.commands.executeCommand('workbench.action.openSettings', 'cooklang.serverPath');
    }
}

export async function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Cooklang');
    context.subscriptions.push(outputChannel);

    const config = vscode.workspace.getConfiguration('cooklang');
    const configuredPath = config.get<string>('serverPath', 'cook');

    outputChannel.appendLine(`Cooklang extension activating...`);
    outputChannel.appendLine(`Configured server path: ${configuredPath}`);

    const serverPath = findCookExecutable(configuredPath);

    if (serverPath === null) {
        outputChannel.appendLine(`ERROR: Could not find cook executable at configured path: ${configuredPath}`);
        await showCookNotFoundError(configuredPath);
        return;
    }

    if (serverPath !== configuredPath) {
        outputChannel.appendLine(`Found cook at: ${serverPath}`);
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (workspaceFolder) {
        outputChannel.appendLine(`Workspace folder: ${workspaceFolder}`);
    } else {
        outputChannel.appendLine(`No workspace folder detected`);
    }

    const serverOptions: ServerOptions = {
        run: {
            command: serverPath,
            args: ['lsp'],
            options: {
                cwd: workspaceFolder,
            },
        },
        debug: {
            command: serverPath,
            args: ['lsp'],
            options: {
                cwd: workspaceFolder,
                env: {
                    ...process.env,
                    RUST_LOG: 'debug',
                },
            },
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'cooklang' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.cook'),
        },
        outputChannel,
        workspaceFolder: workspaceFolder
            ? { uri: vscode.Uri.file(workspaceFolder), name: path.basename(workspaceFolder), index: 0 }
            : undefined,
    };

    client = new LanguageClient(
        'cooklang',
        'Cooklang Language Server',
        serverOptions,
        clientOptions
    );

    try {
        await client.start();
        outputChannel.appendLine('Cooklang language server started successfully');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        outputChannel.appendLine(`ERROR: Failed to start language server: ${errorMessage}`);

        if (errorMessage.includes('ENOENT') || errorMessage.includes('not found')) {
            await showCookNotFoundError(configuredPath);
        } else {
            vscode.window.showErrorMessage(
                `Failed to start Cooklang language server: ${errorMessage}. Check the "Cooklang" output channel for details.`
            );
        }
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
