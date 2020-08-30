import db from "../util/Db";
import {NotFoundError} from "../util/Error";

export async function getUser(id:string){
    const res = await db.query("SELECT * FROM studyuser WHERE id = $1", [id]);
    if(res.rowCount === 0){
        throw new NotFoundError("404: user id doesn't exist")
    }
    const data = res.rows[0];
    return data;
}