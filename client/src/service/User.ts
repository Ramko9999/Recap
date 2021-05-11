import fetch from "node-fetch";
import AuthService from "./Auth";
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
        const headers = {
            "Authorization": `Bearer ${await AuthService.getAccessToken()}`
        };

        const response = await fetch(url, {
            headers: headers
        });

        if(response.status === StatusCodes.NOT_FOUND){
            throw Error(`User ${id} does not exist`);
        }

        const body: any = await response.json();
        if(response.status !== StatusCodes.OK){
            throw Error(body.error);
        }
        return body as NonNullable<User>;
    }

    static async createUser(user: NonNullable<User>) : Promise<NonNullable<User>> {
        const url = new URL("/user/create", SERVICE_URL);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await AuthService.getAccessToken()}`
        };

        const response = await fetch(url, {
            headers: headers,
            body: JSON.stringify(user),
            method: "POST"
        });
        
        if(response.status === StatusCodes.BAD_REQUEST){
            throw Error("Invalid request body");
        }

        const body = await response.json();
        if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
            throw Error(body.error);
        }
        return body as NonNullable<User>;
    };
}

export default UserService;