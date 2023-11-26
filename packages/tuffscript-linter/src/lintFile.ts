import fs from 'fs/promises';
import { Lexer, Parser } from 'tuffscript';
import { TuffScriptLinter } from './index';

// Check if the command-line argument for the file path is provided
if (process.argv.length < 3) {
  console.error('Usage: yarn lintTuffScript <filePath>');
  process.exit(1);
}

const filePath = process.argv[2];

async function lintFile() {
  try {
    const code = await fs.readFile(filePath, 'utf8');
    const lexer = new Lexer(code);
    const tokens = lexer.lexAnalysis();

    const parser = new Parser({ tokens });
    const astTree = parser.produceAST();

    const tuffscriptLinter = new TuffScriptLinter();
    const lintingResults = tuffscriptLinter.lintProgram({ program: astTree });

    console.log(`Linting completed for file: "${filePath}"`);
    console.log('Linting Results:');
    console.log(lintingResults);
  } catch (error) {
    console.error(`Failed to lint the file. Error: ${error}`);
    process.exit(1);
  }
}

lintFile();
