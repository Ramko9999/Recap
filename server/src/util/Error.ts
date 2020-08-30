import express = require("express");

export class NotFoundError extends Error{

    errorMessage:string

    constructor(message:string){
        super(message);
        this.errorMessage = message;
    }
}


export const handleError = (error:Error, res:express.Response) => {
    if(error instanceof NotFoundError){
        res.status(404).send(error.message);
    }
    else{
        res.status(500).send(error.message);
    }
}