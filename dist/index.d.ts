/// <reference types="node" />
import { EventEmitter } from "events";
declare const FS: unique symbol;
declare const PATH: unique symbol;
export default class Error extends EventEmitter {
    private log_file_root;
    private [FS];
    private [PATH];
    private init_error_file;
    private init_log_file;
    private printLog;
    postError(errorName: string, ...args: unknown[]): Error;
    postLog(errorName: string, ...args: unknown[]): Error;
    private log_file_path;
    private error_file_path;
    private file_root;
    private date;
    private sleep;
    private loop;
    private init_address;
    constructor(log_file_root: string);
}
export {};
