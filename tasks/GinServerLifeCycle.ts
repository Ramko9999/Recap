import { existsSync } from "fs";
import { join } from "path";
import child_process from "child_process"
import {error, info, success} from "./Util";

function checkConfig(){
    const envPath = join(__dirname, "..", "server", ".env");
    if(!(existsSync(envPath))){
         error("missing .env file. create it by following directions in readme")
    }
    info("found all config files for gin server");
}

function runGin(){
    const options = {
        cwd: "./server"
    }
    info("spawning a new shell/cmd to run gin server");
    child_process.exec("start cmd.exe /K go run main.go", options);
    setTimeout(() => {
        success("finished gin server lifecycle");
        process.exit()
    }, 10000);
}

function runLifecycle(){
    checkConfig();
    runGin();
}

runLifecycle();