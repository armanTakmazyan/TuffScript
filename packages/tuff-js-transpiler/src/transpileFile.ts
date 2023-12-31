#!/usr/bin/env node
import path from 'path';
import fs from 'fs/promises';
import { Lexer, Parser } from 'tuffscript';
import { Transpiler } from './index';

// Check if the command-line argument for the file path is provided
if (process.argv.length < 3) {
  console.error('Usage: yarn transpile <filePath>');
  process.exit(1);
}

const filePath = process.argv[2];
const fileOutputDirectory = process.argv[3] || '.';

async function transpileFile() {
  try {
    const code = await fs.readFile(filePath, 'utf8');
    const lexer = new Lexer(code);
    const tokens = lexer.lexAnalysis();

    const parser = new Parser({ tokens });
    const astTree = parser.produceAST();

    const transpiler = new Transpiler({ program: astTree });
    const jsCode = transpiler.transpile();

    // Change the file extension to .js
    const fileName = path.basename(filePath).replace(/\.[^/.]+$/, '') + '.js';

    // Ensure output directory exists or create it
    await fs.mkdir(fileOutputDirectory, { recursive: true });

    // Construct the new file path with the output directory
    const newFilePath = path.join(fileOutputDirectory, fileName);

    // Write the transpiled code to the new file
    await fs.writeFile(newFilePath, jsCode, 'utf8');

    // Write the transpiled code to the new file
    await fs.writeFile(newFilePath, jsCode, 'utf8');

    console.log(
      `File "${newFilePath}" has been successfully created with the transpiled code.`,
    );
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
}

transpileFile();
