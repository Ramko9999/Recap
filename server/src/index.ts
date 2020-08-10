import userRouter from "./routes/user";
import express = require("express");
import cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());


app.use("/user", userRouter);

app.listen(5000, ()=>{
    console.log("App is on");
})