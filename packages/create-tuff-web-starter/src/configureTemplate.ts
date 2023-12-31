import path from 'path';
import fs from 'fs-extra';
import pacote from 'pacote';
import { ConfigureTemplateArgs } from './types';
import { updatePackageJson } from './updatePackageJson';

// const isLocal = process.env.NODE_ENV === 'development';
const isLocal = true;
const tuffWebStarter = 'tuff-web-starter';
const tuffWebStarterVersion = 'latest';
const localTuffWebStarterPath = `../../${tuffWebStarter}`;

export async function configureTemplate({
  projectName,
  projectDirectory,
}: ConfigureTemplateArgs): Promise<void> {
  try {
    if (isLocal) {
      const localPath = path.join(__dirname, localTuffWebStarterPath);
      console.log(`Using local template for ${projectDirectory}`);
      await fs.copy(localPath, projectDirectory);
    } else {
      console.log(
        `Downloading package ${tuffWebStarter}@${tuffWebStarterVersion}`,
      );
      await pacote.extract(
        `${tuffWebStarter}@${tuffWebStarterVersion}`,
        projectDirectory,
      );
      console.log('Template downloaded and extracted successfully');
    }

    console.log('All files have been copied to the project directory');

    // Call the function to update package.json
    await updatePackageJson({
      projectName,
      projectDirectory,
    });

    const exampleScriptPath = path.join(projectDirectory, 'exampleScript.js');
    await fs.remove(exampleScriptPath);
  } catch (error) {
    console.error('Failed to configure template:', error);
  }
}
