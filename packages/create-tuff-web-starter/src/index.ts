#!/usr/bin/env node
import path from 'path';
import { program } from 'commander';
import { configureTemplate } from './configureTemplate';

program.version('1.0.0').action(async () => {
  const inquirer = await import('inquirer');

  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter the project name:',
      validate: (input: string) => (input ? true : 'Project name is required'),
    },
    {
      type: 'input',
      name: 'projectDirectory',
      message:
        'Enter the project directory (leave empty for current directory):',
      default: '',
    },
  ] as const;

  const prompt = inquirer.createPromptModule();

  const answers = await prompt<{
    projectName: string;
    projectDirectory?: string;
  }>(questions);

  // If no project directory is provided, use the current directory with the project name as a subdirectory
  const targetDirectory = answers.projectDirectory
    ? path.join(process.cwd(), answers.projectDirectory, answers.projectName)
    : path.join(process.cwd(), answers.projectName);

  configureTemplate({
    projectName: answers.projectName,
    projectDirectory: targetDirectory,
  });
});

program.parse(process.argv);
