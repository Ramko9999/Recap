import userRouter from "./routes/user";
import express = require("express");


const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.listen(5000, ()=>{
    console.log("App is on");
})