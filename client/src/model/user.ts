export default class User{

    id:string
    firstName:string
    lastName:string
    email:string
    joinDate: string
    profileUrl:string
    points:number
    balance:number


    constructor(json: any){
        this.id = json["id"];
        this.firstName = json["first_name"];
        this.lastName = json["last_name"];
        this.email = json["email"];
        this.joinDate = json["created_account"];
        this.profileUrl = json["profile_url"];
        this.points = json["points"];
        this.balance = json["balance"];
    }

    getId(){
        return this.id;
    }

    getFirstName(){
        return this.firstName;
    }

    getLastName(){
        return this.lastName;
    }

    getFullName(){
        return `${this.firstName} ${this.lastName}`;
    }

    getEmail(){
        return this.email;
    }

    getJoinDate(){
        return this.joinDate;
    }

    getProfileUrl(){
        return this.profileUrl;
    }

    getPoints(){
        return this.points;
    }

    getBalance(){
        return this.balance;
    }

    canGetQuizzed(){
        return this.balance > 0;
    }

    getLevel(){
        return 1;
    }
}