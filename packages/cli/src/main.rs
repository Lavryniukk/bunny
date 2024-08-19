use std::fs::{create_dir_all, write};

use clap::{command, Parser, Subcommand};

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand)]
enum Command {
    New { dir: Option<String> },
}

fn initialize_project(path: String) -> Result<(), std::io::Error> {
    write(path, "Done")
}

fn handle_new_command(name: Option<String>) -> Result<(), std::io::Error> {
    let path = name.unwrap_or("./".to_string());

    let dir_exists = std::path::Path::new(&path).exists();

    if !dir_exists {
        create_dir_all(&path)?;
    }

    initialize_project(path + "/index.ts")
}

fn main() {
    let matches = Cli::parse();

    match matches.command {
        Some(Command::New { dir }) => {
            handle_new_command(dir).expect("Failed to create new project");
        }
        None => println!("No command provided"),
    }
}
