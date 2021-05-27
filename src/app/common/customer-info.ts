import { Address } from "./address";
import { Customer } from "./customer";

export class CustomerInfo {
    firstName:string = "";
    lastName: string = "";
    shippingAddress: Address = new Address();
    billingAddress: Address = new Address();
}
