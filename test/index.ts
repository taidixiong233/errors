import Error from "../src";
import * as path from "path";

const error = new Error(path.join(__dirname, "./logs"));

setInterval(() => error.postError(String(Date.now())), 1000);
setInterval(() => error.postLog(String(Date.now())), 1000);
