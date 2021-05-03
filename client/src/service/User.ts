
export type User = {
    id: string,
    email: string,
    username: string,
} | null;


class UserService {

    static async getUser(id: string) : Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: id,
                    email: "arnold@gmail.com",
                    username: "Arnold Palmer"
                });
            }, 1000);
        })
    }

    static async createUser(user: NonNullable<User>) : Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(user);
            }, 1000)
        });
    };
}

export default UserService;