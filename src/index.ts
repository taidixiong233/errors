import * as path from "path";
import * as fs from "fs";
import { EventEmitter } from "events";
import { nextTick } from "process";
import nodeschedule from "node-schedule";

const FS = Symbol("FS");
const PATH = Symbol("PATH");
const NODESCHEDULE = Symbol("NODESCHEDULE");

export default class Error extends EventEmitter {
  private [FS] = fs;
  private [PATH] = path;
  private [NODESCHEDULE] = nodeschedule;

  //private tmp = 1;
  private init_error_file(): Error {
    const time = new Date();
    const name = `[ERROR]-${time.getFullYear()}${this.Add0x20(
      time.getMonth() + 1,
      2
    )}${this.Add0x20(time.getDate(), 2)}.log`;
    this.error_file_path = this[PATH].join(this.file_root, name);

    this.printLog("错误日志追踪文件初始化结束", "error");
    return this;
  }

  private init_log_file(): Error {
    const time = new Date();
    const name = `[LOG]-${time.getFullYear()}${this.Add0x20(
      time.getMonth() + 1,
      2
    )}${this.Add0x20(time.getDate(), 2)}.log`;
    this.log_file_path = this[PATH].join(this.file_root, name);

    this.printLog("日志追踪文件初始化结束", "log");
    return this;
  }

  private printLog(log: object, level: "log" | "error"): void;
  private printLog(log: string, level: "log" | "error"): void;
  private printLog(log: string | object, level: "log" | "error"): void {
    const time = new Date();
    if (typeof log != "string") log = JSON.stringify(log);
    const con = `[${
      level == "log" ? " LOG " : "ERROR"
    }][${time.getFullYear()}-${this.Add0x20(
      time.getMonth() + 1,
      2
    )}-${this.Add0x20(time.getDate(), 2)}T${this.Add0x20(
      time.getHours(),
      2
    )}:${this.Add0x20(time.getMinutes(), 2)}:${this.Add0x20(
      time.getSeconds(),
      2
    )}:${this.Add0x20(time.getMilliseconds(), 3)}] ${log}`;

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

  private Init_updata(): Error {
    this[NODESCHEDULE].scheduleJob("0 0 0 * * *", () => {
      this.init_address();
    });
    return this;
  }

  private init_address(): Error {
    let address = this[PATH].join(this.log_file_root);

    if (!fs.existsSync(this.log_file_root)) {
      fs.mkdirSync(this.log_file_root);
    }

    if (!this[FS].statSync(address).isDirectory()) {
      address = this[PATH].join(this.log_file_root, "..");
    }

    this.file_root = address;

    this.init_error_file();
    this.init_log_file();
    //this.tmp++;
    return this;
  }

  constructor(private log_file_root: string) {
    super();
    this.init_address();
    this.Init_updata();
  }

  private Add0x20(str: string | number, length: number): string {
    let ret = String(str);
    for (let i = 0; i < length - ret.length; ++i) {
      ret = "0" + ret;
    }
    return ret;
  }
}
