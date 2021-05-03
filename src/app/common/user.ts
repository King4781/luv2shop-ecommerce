import { Token } from "./token";

export class User {
    id: string;
    email: string;
    name: string;
    token: Token;

    constructor(id:string, email:string, name:string, token:Token) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.token = token;
    }
}
