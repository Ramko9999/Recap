
export type User = {
    id: string,
    email: string,
    firstName: string,
    lastName: string
} | null;


class UserService {

    static async getUser(id: string) : Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: id,
                    email: "arnold@gmail.com",
                    firstName: "Arnold",
                    lastName: "Palmer"
                })
            }, 100);
        })
    }
}

export default UserService;