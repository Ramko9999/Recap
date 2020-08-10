import express = require("express");
import { getUser } from "../services/user";
const userRouter = express.Router();


userRouter.get("/:id", async(req, res)=>{
    try{
        const data = await getUser(req.params.id);
        console.log(data);
        res.json(data);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

export default userRouter;
