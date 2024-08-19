mod files;
use std::{
    fs::{create_dir_all, write},
    process::Command,
};

use clap::{command, Parser, Subcommand};

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    New { dir: Option<String> },
}

fn initialize_project(path: &str) -> Result<(), std::io::Error> {
    let index_path = format!("{}/index.ts", path);
    let core_path = format!("{}/core.ts", path);

    write(index_path, files::INDEX_CONTENT)?;
    write(core_path, files::CORE_CONTENT)
}

fn handle_new_command(name: Option<&str>) -> Result<(), std::io::Error> {
    let path = name.unwrap_or(".");

    let dir_exists = std::path::Path::new(path).exists();

    if !dir_exists {
        create_dir_all(path)?;
    }

    initialize_project(path)?;
    Command::new("bun")
        .arg("init")
        .arg("-y")
        .current_dir(path)
        .spawn()?;

    Command::new("bun")
        .arg("add")
        .arg("@bunny-ts/core")
        .current_dir(path)
        .spawn()?;
    Ok(())
}

fn main() {
    let matches = Cli::parse();

    match matches.command {
        Some(Commands::New { dir }) => {
            let path = dir.as_deref();
            handle_new_command(path).expect("Failed to create new project");
        }
        None => println!("No command provided"),
    }
}
