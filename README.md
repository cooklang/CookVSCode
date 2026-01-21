# Cooklang

A [Visual Studio Code](https://code.visualstudio.com) extension for the [Cooklang markup language](https://cooklang.org), providing syntax highlighting and language server features.

## Features

- **Syntax Highlighting** - Colorization for ingredients, cookware, timers, and more
- **Auto-completion** - Smart suggestions for ingredients, cookware, units, and time units
- **Diagnostics** - Real-time syntax checking and error reporting
- **Hover Information** - View ingredient details and quantities
- **Document Outline** - Navigate recipe structure

## Requirements

This extension requires the [`cook`](https://github.com/cooklang/cookcli) CLI tool to be installed for language server features.

Install `cook` and ensure it's available in your PATH.

## Installation

### Visual Studio Code

Install the [Cooklang extension](https://marketplace.visualstudio.com/items?itemName=dubadub.cook) from the marketplace.

## Configuration

You can customize the path to the `cook` executable in VS Code settings:

```json
{
  "cooklang.serverPath": "cook"
}
```

If `cook` is not in your PATH, provide the full path to the executable.


## License

The MIT License (MIT)

Copyright (c) 2021 Alexey Dubovskoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
