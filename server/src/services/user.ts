import db from "../util/db";

export async function getUser(id:string){
    const res = await db.query("SELECT * FROM studyuser WHERE id = $1", [id]);
    const data = res.rows[0];
    return data;
}