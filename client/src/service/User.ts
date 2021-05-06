import fetch from "node-fetch";
import {StatusCodes} from "http-status-codes";
import {SERVICE_URL} from "./ServiceConfig";

export type User = {
    id: string,
    email: string,
    username: string,
} | null;


class UserService {

    static async getUser(id: string) : Promise<NonNullable<User>> {

        const url = new URL(`/user/${id}`, SERVICE_URL);

        const response = await fetch(url);

        const body: any = await response.json();
        if(response.status !== StatusCodes.OK){
            throw Error(body.error);
        }
        return body as NonNullable<User>;
    }

    static async createUser(user: NonNullable<User>) : Promise<NonNullable<User>> {
        const url = new URL("/user/create", SERVICE_URL);
        const headers = {
            "Content-Type": "application/json"
        };

        const response = await fetch(url, {
            headers: headers,
            body: JSON.stringify(user),
            method: "POST"
        });
        
        const body = await response.json()
        if(response.status !== StatusCodes.CREATED){
            throw Error(body.error);
        }
        return body as NonNullable<User>;
    };
}

export default UserService;