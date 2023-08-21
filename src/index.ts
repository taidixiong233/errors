import * as path from "path";
import * as fs from "fs";
import { EventEmitter } from "events";
import { nextTick } from "process";

const FS = Symbol("FS");
const PATH = Symbol("PATH");

export default class Error extends EventEmitter {
  private [FS] = fs;
  private [PATH] = path;

  private init_error_file(): Error {
    const name = `[ERROR]-${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}.log`;
    this.error_file_path = this[PATH].join(this.file_root, name);

    this.printLog("错误日志追踪文件初始化结束", "error");
    return this;
  }

  private init_log_file(): Error {
    const name = `[LOG]-${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}.log`;
    this.log_file_path = this[PATH].join(this.file_root, name);

    this.printLog("日志追踪文件初始化结束", "log");
    return this;
  }

  private printLog(log: object, level: "log" | "error"): void;
  private printLog(log: string, level: "log" | "error"): void;
  private printLog(log: string | object, level: "log" | "error"): void {
    if (typeof log != "string") log = JSON.stringify(log);
    const con = `[${
      level == "log" ? "LOG" : "ERROR"
    }][${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}:${this.date.getMilliseconds()}] ${log}`;

    console.log(con);

    this[FS].appendFileSync(
      this[`${level == "log" ? "log" : "error"}_file_path`],
      `${con}\n`
    );
  }

  public async postError(errorName: string, ...args: unknown[]): Promise<void> {
    if (args.length === 0) {
      this.printLog(errorName, "error");
    } else {
      this.printLog(`${errorName}:${JSON.stringify(args)}`, "error");
    }
    nextTick(() => this.emit(errorName, args));
  }

  public async postLog(errorName: string, ...args: unknown[]): Promise<void> {
    if (args.length === 0) {
      this.printLog(errorName, "log");
    } else {
      this.printLog(`${errorName}:${JSON.stringify(args)}`, "log");
    }
    nextTick(() => this.emit(errorName, args));
  }

  private log_file_path!: string;
  private error_file_path!: string;
  private file_root!: string;

  private date = new Date();

  private sleep = async (ms = 1000): Promise<void> => {
    return new Promise<void>((r) => {
      setTimeout(() => {
        r();
      }, ms);
    });
  };

  private async loop(): Promise<void> {
    if (this.date.getDay() != new Date().getDay()) {
      this.date = new Date();
      this.init_address();
      return new Promise((r) => r());
    } else {
      await this.sleep();
      this.loop();
    }
  }

  private init_address(): Error {
    let address = this[PATH].join(this.log_file_root);
    if (!this[FS].statSync(address).isDirectory()) {
      address = this[PATH].join(this.log_file_root, "..");
    }

    this.file_root = address;

    this.init_error_file();
    this.init_log_file();

    this.loop();

    return this;
  }

  constructor(private log_file_root: string) {
    super();
    this.init_address();
  }
}
