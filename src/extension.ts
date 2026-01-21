import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('cooklang');
    const serverPath = config.get<string>('serverPath', 'cook');
    const traceServer = config.get<string>('trace.server', 'off');

    const serverOptions: ServerOptions = {
        run: {
            command: serverPath,
            args: ['lsp'],
        },
        debug: {
            command: serverPath,
            args: ['lsp'],
            options: {
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
    };

    client = new LanguageClient(
        'cooklang',
        'Cooklang Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
