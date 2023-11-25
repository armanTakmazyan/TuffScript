import * as vscode from 'vscode';

async function loadModule(moduleName: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('No workspace folder is open.');
  }

  let tuffScriptModule;
  for (const folder of workspaceFolders) {
    try {
      const workspaceFolderPath = folder.uri.fsPath;
      const localModulePath = require.resolve(moduleName, {
        paths: [workspaceFolderPath],
      });
      tuffScriptModule = require(localModulePath);
      break; // Stop if module is found
    } catch (error) {
      // Continue checking next folder
    }
  }

  if (!tuffScriptModule) {
    throw new Error(`${moduleName} module not found in any workspace folder`);
  }

  return tuffScriptModule;
}

let outputChannel: vscode.OutputChannel;

function getOrCreateOutputChannel({ name }: { name: string }) {
  // Check if the outputChannel already exists and has the same name
  if (outputChannel && outputChannel.name === name) {
    return outputChannel;
  } else {
    // Dispose the existing channel if it's not the right one
    if (outputChannel) {
      outputChannel.dispose();
    }

    // Create a new output channel
    outputChannel = vscode.window.createOutputChannel(name);
    return outputChannel;
  }
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const disposable = vscode.commands.registerCommand(
    'tuffScriptFormatter.formatCode',
    async () => {
      vscode.window.showInformationMessage(
        'TuffScript Formatter extension is now active',
      );
      try {
        const { Lexer, Parser } = await loadModule('tuffscript');
        const { tuffScriptFormatter } = await loadModule(
          'tuffscript-formatter',
        );

        context.subscriptions.push(
          vscode.languages.registerDocumentFormattingEditProvider(
            'tuffscript',
            {
              provideDocumentFormattingEdits(document) {
                const lexer = new Lexer(document.getText());
                const tokens = lexer.lexAnalysis();

                const parser = new Parser({ tokens });
                const astTree = parser.produceAST();

                const formattedCode = tuffScriptFormatter({ program: astTree });

                const outputChannel = getOrCreateOutputChannel({
                  name: 'TuffScript Formatter',
                });
                outputChannel.appendLine('TuffScript: Formatting Completed');

                return [
                  vscode.TextEdit.replace(
                    new vscode.Range(
                      document.positionAt(0),
                      document.positionAt(document.getText().length),
                    ),
                    formattedCode,
                  ),
                ];
              },
            },
          ),
        );
      } catch (error) {
        vscode.window.showErrorMessage(`
          TuffScript or TuffScript Formatter was not found.
          Please make sure to install one of them, either locally or globally.
        `);
      }
    },
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand('tuffScriptFormatter.formatCode');
}
