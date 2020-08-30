import express = require("express");
import { getUser } from "../services/User";
import { handleError } from "../util/Error";
const userRouter = express.Router();


const validateRequest = (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send("Id is not supplied");
    }
    else{
        next()
    }
}

userRouter.get("/:id", validateRequest, async(req, res)=>{
    try{
        const data = await getUser(req.params.id);
        res.json(data);
    }
    catch(error){
        console.log(error.message);
        handleError(error, res);
    }
});

export default userRouter;
