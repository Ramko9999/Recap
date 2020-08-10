import url from '../config/config';
import fetch from "node-fetch";

export default class UserApi{

    static async getUser(id: string, callback?:(err:string)=>void){
        try{
            const reqUrl = url + `/user/${id}`;
            const res = await fetch(reqUrl);
            if(res.status !== 200){
                throw Error(res.statusText);
            }
            const json = await res.json();
            return json;
        }
        catch(error){
            if(callback){
                callback(error.message)
            }
            else{
                throw Error(error.message);
            }
        }
    }
}