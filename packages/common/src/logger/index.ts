export class Logger {
  public static success(message: string): void {
    console.log(`\x1b[32m [✅] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `);
  }
  public static error(message: string): void {
    console.log(`\x1b[31m [❌] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `);
  }
  public static log(message: string): void {
    console.log(`\x1b[37m [ℹ️] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `);
  }
}

Logger.log('heloo wolrd');
