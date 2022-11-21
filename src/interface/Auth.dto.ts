import { vendorPayload } from "./vendor.dto";
import { UserPayload } from "./user.dto";


export type AuthPayload = vendorPayload | UserPayload ;
