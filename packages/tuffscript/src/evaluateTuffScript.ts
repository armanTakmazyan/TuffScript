#!/usr/bin/env node
import util from 'util';
import fs from 'fs/promises';
import { Lexer, Parser, Interpreter } from './index';

// Check if the command-line argument for the file path is provided
if (process.argv.length < 3) {
  console.error('Usage: yarn evaluateTuffScript <filePath>');
  process.exit(1);
}

const filePath = process.argv[2];

async function evaluateTuffScript() {
  try {
    const code = await fs.readFile(filePath, 'utf8');
    const lexer = new Lexer(code);
    const tokens = lexer.lexAnalysis();

    const parser = new Parser({ tokens });
    const astTree = parser.produceAST();

    const interpreter = new Interpreter({ program: astTree });

    const result = interpreter.evaluate();

    console.log(
      util.inspect(result, { showHidden: false, depth: null, colors: true }),
    );
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
}

evaluateTuffScript();
