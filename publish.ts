import { execSync } from 'child_process';

const newVersion = process.argv[2];
const packageName = process.argv[3]; // Added packageName argument
const packages = ['core', 'common'];
if (!packages.includes(packageName)) {
  console.log('Package does not exist');
  process.exit(1);
}
if (!newVersion || !packageName) {
  console.error('Please provide a version number and a package name.');
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

try {
  // Check if inside a Git repository
  runCommand('git rev-parse --is-inside-work-tree');

  // Ensure there are no uncommitted changes
  const status = runCommand('git status --porcelain');
  if (status) {
    console.error('There are uncommitted changes. Please commit or stash them before publishing.');
    process.exit(1);
  }

  const packagePath = `packages/${packageName}`;

  log(`Updating version to ${newVersion} for package ${packageName}`);
  runCommand(`npm version ${newVersion} --no-git-tag-version --prefix ${packagePath}`);

  log('Staging changes');
  runCommand(`git add ${packagePath}/package.json`);

  log('Committing changes');
  runCommand(`git commit -m "Bump version to ${newVersion} in @${packageName}"`);

  log('Creating git tag');
  runCommand(`git tag ${packageName}@v${newVersion}`);

  log('Pushing to remote');
  runCommand('git push');
  runCommand('git push --tags');

  log(`Version ${newVersion} of ${packageName} has been published successfully.`);
} catch (error) {
  console.error('An error occurred during publishing:', error);
  process.exit(1);
}
