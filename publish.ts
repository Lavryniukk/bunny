import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a new version number as an argument.');
  process.exit(1);
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    throw error;
  }
}

function log(message: string) {
  console.log(`\x1b[32m✔️ ${message}\x1b[0m`);
}

function updatePackageVersion(packagePath: string, version: string) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

try {
  // Check if inside a Git repository
  runCommand('git rev-parse --is-inside-work-tree');

  // Ensure there are no uncommitted changes
  const status = runCommand('git status --porcelain');
  if (status) {
    console.error('There are uncommitted changes. Please commit or stash them before publishing.');
    process.exit(1);
  }

  // 1. Update version in the main package.json
  log(`Updating main package.json version to ${newVersion}`);
  updatePackageVersion('package.json', newVersion);

  // 2. Update version in all packages
  log('Updating version in all packages');
  const packagesDir = path.join(__dirname, 'packages');
  const packages = fs.readdirSync(packagesDir);

  for (const pkg of packages) {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      updatePackageVersion(packageJsonPath, newVersion);
    }
  }

  // 3. Stage all changes
  log('Staging all changes');
  runCommand('git add .');

  // 4. Commit changes
  log('Committing changes');
  runCommand(`git commit -m "@bunny-ts Bump version to ${newVersion}"`);

  // Create git tag
  log('Creating git tag');
  runCommand(`git tag ${newVersion}`);

  // Push changes and tags
  log('Pushing to remote');
  runCommand('git push');
  runCommand('git push --tags');

  log(`Version ${newVersion} of Bunny-ts has been published successfully.`);
  log('GitHub Action will now build and publish packages to npm.');
} catch (error) {
  console.error('An error occurred during publishing:', error);
  process.exit(1);
}
