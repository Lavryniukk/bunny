import { execSync } from "child_process";

const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Please provide a version number");

  process.exit(1);
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    throw error;
  }
}
export function log(message: string) {
  console.log(`\x1b[32m✔️ ${message}\x1b[0m`);
}
try {
  runCommand("git rev-parse --is-inside-work-tree");

  const status = runCommand("git status --porcelain");
  if (status) {
    console.error(
      "There are uncommitted changes. Please commit or stash them before publishing.",
    );
    process.exit(1);
  }

  log(`Updating version to ${newVersion}`);
  runCommand(`npm version ${newVersion} --no-git-tag-version`);

  log("Staging changes");
  runCommand("git add package.json");

  log("Committing changes");
  runCommand(`git commit -m "Bump version to ${newVersion}"`);

  log("Creating git tag");
  runCommand(`git tag v${newVersion}`);

  log("Pushing to remote");
  runCommand("git push");
  runCommand("git push --tags");

  log(`Version ${newVersion} has been published successfully.`);
} catch (error) {
  console.error("An error occurred during publishing:", error);
  process.exit(1);
}
