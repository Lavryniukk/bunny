export class Logger {
  public static success(message: string, ...rest: any[]): void {
    console.log(`\x1b[32m [✅] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `, rest);
  }
  public static error(message: string, ...rest: any[]): void {
    console.log(`\x1b[31m [❌] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `, rest);
  }
  public static log(message: string, ...rest: any[]): void {
    console.log(`\x1b[37m [ℹ️] ${new Date().toLocaleTimeString()} ---> \x1b[0m ${message} `, rest);
  }
}

Logger.log('heloo wolrd');
