"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const events_1 = require("events");
const FS = Symbol("FS");
const PATH = Symbol("PATH");
class Error extends events_1.EventEmitter {
    init_error_file() {
        const name = `[ERROR]-${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}.log`;
        this.error_file_path = this[PATH].join(this.file_root, name);
        this.printLog("错误日志追踪文件初始化结束", "error");
        return this;
    }
    init_log_file() {
        const name = `[LOG]-${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}.log`;
        this.log_file_path = this[PATH].join(this.file_root, name);
        this.printLog("日志追踪文件初始化结束", "log");
        return this;
    }
    printLog(log, level) {
        if (typeof log != "string")
            log = JSON.stringify(log);
        const con = `[${level == "log" ? "LOG" : "ERROR"}][${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}:${this.date.getMilliseconds()}] ${log} \n`;
        console.log(con);
        this[FS].appendFileSync(this[`${level == "log" ? "log" : "error"}_file_path`], con);
    }
    postError(errorName, ...args) {
        this.emit(errorName, args);
        if (args.length === 0) {
            this.printLog(errorName, "error");
        }
        else {
            this.printLog(`${errorName}:${JSON.stringify(args)}`, "error");
        }
        return this;
    }
    postLog(errorName, ...args) {
        this.emit(errorName, args);
        if (args.length === 0) {
            this.printLog(errorName, "log");
        }
        else {
            this.printLog(`${errorName}:${JSON.stringify(args)}`, "log");
        }
        return this;
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.date.getDay() != new Date().getDay()) {
                this.init_address();
                return new Promise((r) => r());
            }
            else {
                yield this.sleep();
                this.loop();
            }
        });
    }
    init_address() {
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
    constructor(log_file_root) {
        super();
        this.log_file_root = log_file_root;
        this[_a] = fs;
        this[_b] = path;
        this.date = new Date();
        this.sleep = (ms = 1000) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((r) => {
                setTimeout(() => {
                    r();
                }, ms);
            });
        });
        this.init_address();
    }
}
_a = FS, _b = PATH;
exports.default = Error;
