import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { EventEmitter } from "events";

const __filename = fileURLToPath(import.meta.url);
const LOG_FILE_PARENT_DIR = path.join(__filename, "..", "logs");
const LOG_FILE_PATH = path.join(LOG_FILE_PARENT_DIR, "server.log");

if (!fs.existsSync(LOG_FILE_PARENT_DIR)) {
  fs.mkdirSync(LOG_FILE_PARENT_DIR);
}

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100);

const logService = {
  log: (message) => {
    const logMessage = `[${new Date().toISOString()}] [INFO] ${message}\n`;
    fs.appendFileSync(LOG_FILE_PATH, logMessage);
    console.log(logMessage);
  },
  error: (message, error) => {
    const errorMessage = `[${new Date().toISOString()}] [ERROR] ${message}: ${error}\n`;
    fs.appendFileSync(LOG_FILE_PATH, errorMessage);
    console.error(errorMessage);
  },
};

export default logService;