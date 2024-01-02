import * as path from 'path';
import * as fs from 'fs/promises';
import * as vscode from 'vscode';
import type {
  Lexer as TuffScriptLexer,
  Parser as TuffScriptParser,
} from 'tuffscript';
import { Position } from 'tuffscript/token/types';
import type { TuffScriptLinter } from 'tuffscript-linter';

const configFileName = 'tuff-linter.config.json';

async function findLinterConfig(documentPath: string): Promise<any | null> {
  // Retrieve the first workspace folder as the root; this can be adjusted as needed for multi-root workspaces
  const workspaceRoot = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : null;

  if (!workspaceRoot) {
    // No workspace is open
    return null;
  }

  let currentDirectory = path.dirname(documentPath);

  while (currentDirectory) {
    const potentialConfigPath = path.join(currentDirectory, configFileName);

    try {
      const fileContent = await fs.readFile(potentialConfigPath, 'utf8');
      const config = JSON.parse(fileContent);
      return config;
    } catch (error) {
      // If error occurs (file not found, can't open, or parsing issue), continue looking
    }

    // If reached the root of the workspace or system root, stop
    if (
      path.dirname(currentDirectory) === workspaceRoot ||
      currentDirectory === path.dirname(currentDirectory)
    ) {
      break;
    }

    // Move up one directory
    currentDirectory = path.dirname(currentDirectory);
  }

  return null;
}

// TODO: Create a seperate global helpers package for this
async function loadModule(moduleName: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('No workspace folder is open.');
  }

  let module;
  for (const folder of workspaceFolders) {
    try {
      const workspaceFolderPath = folder.uri.fsPath;
      const localModulePath = require.resolve(moduleName, {
        paths: [workspaceFolderPath],
      });
      module = require(localModulePath);
      break; // Stop if module is found
    } catch (error) {
      // Continue checking next folder
    }
  }

  if (!module) {
    throw new Error(`${moduleName} module not found in any workspace folder`);
  }

  return module;
}

let diagnosticCollection: vscode.DiagnosticCollection;
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
  diagnosticCollection =
    vscode.languages.createDiagnosticCollection('tuffScript');

  context.subscriptions.push(diagnosticCollection);

  // Register the command that will activate the linter
  const disposable = vscode.commands.registerCommand(
    'tuffScriptLinter.lintCode',
    async () => {
      vscode.window.showInformationMessage(
        'TuffScript Linter extension is now active',
      );

      try {
        // Load the necessary modules for linting
        const { Lexer, Parser } = await loadModule('tuffscript');
        const { TuffScriptLinter } = await loadModule('tuffscript-linter');

        const handleLinting = (document: vscode.TextDocument) => {
          lintDocument({
            document: document,
            Lexer,
            Parser,
            Linter: TuffScriptLinter,
          });
        };

        // Perform initial linting of all open documents
        vscode.workspace.textDocuments.forEach(document => {
          handleLinting(document);
        });

        vscode.workspace.onDidChangeTextDocument(event => {
          handleLinting(event.document);
        });

        vscode.workspace.onDidOpenTextDocument(document => {
          handleLinting(document);
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `TuffScript or TuffScript Linter was not found. Please make sure to install one of them, either locally or globally.`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand('tuffScriptLinter.lintCode');
}

// TODO: Display errors that may arise during tokenization and parsing stages
async function lintDocument({
  document,
  Lexer,
  Parser,
  Linter,
}: {
  document: vscode.TextDocument;
  Lexer: typeof TuffScriptLexer;
  Parser: typeof TuffScriptParser;
  Linter: typeof TuffScriptLinter;
}) {
  if (document.languageId !== 'tuffscript') return;

  const lexer = new Lexer(document.getText());
  const tokens = lexer.lexAnalysis();

  const parser = new Parser({ tokens });
  const astTree = parser.produceAST();

  const documentPath = document.uri.fsPath;
  const linterConfig = await findLinterConfig(documentPath);

  const tuffScriptLinter = new Linter({
    globalImmutableSymbols: linterConfig?.globalImmutableSymbols ?? [],
  });

  const lintingResults = tuffScriptLinter.lintProgram({ program: astTree });

  const outputChannel = getOrCreateOutputChannel({ name: 'TuffScript Linter' });

  // TODO: Refine diagnostic clearing strategy to preserve diagnostics for currently open and linted files
  diagnosticCollection.clear();
  const diagnostics: vscode.Diagnostic[] = [];

  const createDiagnosticMessage = ({
    position,
    message,
    severity,
  }: {
    message: string;
    position: Position;
    severity: vscode.DiagnosticSeverity;
  }) => {
    const startPosition = document.positionAt(position.start);
    const endPosition = document.positionAt(position.end);
    const range = new vscode.Range(startPosition, endPosition);
    diagnostics.push(new vscode.Diagnostic(range, message, severity));
  };

  lintingResults.unresolvedReferences.forEach(unresolvedReference => {
    createDiagnosticMessage({
      position: unresolvedReference.position,
      severity: vscode.DiagnosticSeverity.Error,
      message: `Unresolved Reference: ${unresolvedReference.identifier}`,
    });
  });

  lintingResults.referencesBeforeAssignment.forEach(
    referenceBeforeAssignment => {
      createDiagnosticMessage({
        position: referenceBeforeAssignment.position,
        severity: vscode.DiagnosticSeverity.Error,
        message: `Referenced before assignment: ${referenceBeforeAssignment.identifier}`,
      });
    },
  );

  lintingResults.unusedSymbols.forEach(unusedSymbol => {
    createDiagnosticMessage({
      position: unusedSymbol.position,
      severity: vscode.DiagnosticSeverity.Warning,
      message: `Unused variable: ${unusedSymbol.name}`,
    });
  });

  diagnosticCollection.set(document.uri, diagnostics);

  outputChannel.appendLine(
    `TuffScript: Linting Completed for - ${document.uri}`,
  );
}
