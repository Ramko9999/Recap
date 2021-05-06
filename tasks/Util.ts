import colors from "colors";

function error(message: string){
    console.log(colors.red(`Error: ${message}`));
    process.exit(1);
}

function info(message: string){
    console.log(colors.bgBlack(message));
}

function success(message: string){
    console.log(colors.green(message));
}

export {error, info, success};