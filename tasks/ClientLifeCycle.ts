import child_process from "child_process";
import {join} from "path";
import { existsSync } from "fs";
import {error, info, success} from "./Util";

function checkConfig(){
    const configPath = join(__dirname, "..", "client", "src", "config");
    const firebasePath = join(configPath, "firebase.json");
    const servicesPath = join(configPath, "http.json");

    if(!existsSync(firebasePath)){
        error("missing firebase.json. Ask Ramko9999 for it");
    }

    if(!existsSync(servicesPath)){
        error("missing http.json. Ask Ramko9999 for it");
    }
    info("found all config files for client");
}

function startReact(){
    const options = {
        cwd: "./client"
    };

    info("spawning a new shell/cmd to run React");
    child_process.exec("start cmd.exe /K npm start", options);
    setTimeout(() => {
        success("finished client lifecycle");
        process.exit();
    }, 10000);
    
}

function runLifecycle(){
    checkConfig();
    startReact();
}

runLifecycle();

