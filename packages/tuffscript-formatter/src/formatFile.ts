import fs from 'fs/promises';
import { Lexer, Parser } from 'tuffscript';
import { tuffScriptFormatter } from './index';

// Check if the command-line argument for the file path is provided
if (process.argv.length < 3) {
  console.error('Usage: yarn formatTuffScript <filePath>');
  process.exit(1);
}

const filePath = process.argv[2];

async function modifyFile() {
  try {
    const code = await fs.readFile(filePath, 'utf8');
    const lexer = new Lexer(code);
    const tokens = lexer.lexAnalysis();

    const parser = new Parser({ tokens });
    const astTree = parser.produceAST();

    const formattedCode = tuffScriptFormatter({ program: astTree });

    await fs.writeFile(filePath, formattedCode, 'utf8');

    console.log(`File "${filePath}" has been successfully modified`);
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
}

modifyFile();
