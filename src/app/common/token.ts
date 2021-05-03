export class Token {
    access: string;
    expiresAt: number;
    expiresIn: number;
    refresh: string;
    type: string;

    constructor(access:string, expiresAt:number, expiresIn:number, refresh:string, type:string) {
        this.access = access;
        this.expiresAt = expiresAt;
        this.expiresIn = expiresIn;
        this.refresh = refresh;
        this.type = type;
    }
}
