import path from 'path';
import fs from 'fs-extra';
import { updatePackageJsonArgs } from './types';

export async function updatePackageJson({
  projectName,
  projectDirectory,
}: updatePackageJsonArgs): Promise<void> {
  const packageJsonPath = path.join(projectDirectory, 'package.json');
  try {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.name = projectName;
    packageJson.description = `${projectName} project`;
    delete packageJson.author;

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log('Updated package.json successfully');
  } catch (error) {
    console.error('Failed to update package.json:', error);
  }
}
