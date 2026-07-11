import 'dotenv/config';
import { v5 as uuidv5 } from "uuid";
import { NAMESPACEIsNotDefined } from "./exceptions";

export default class UUID {
    private static readonly NAMESPACE: string = process.env.NAMESPACE ?? "";

    public static getTokenIDForPlayer(username: string, tag: string): string {
        if (!this.NAMESPACE) {
            throw new NAMESPACEIsNotDefined();
        }

        return uuidv5(username + tag, this.NAMESPACE);
    }
}