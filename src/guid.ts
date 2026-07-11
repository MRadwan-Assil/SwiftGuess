import { v5 as uuidv5 } from "uuid";

export default class UUID {
    private static readonly NAMESPACE = '6b86b273-ed34-477a-9967-64b63945476c';

    public static getTokenIDForPlayer(username: string, tag: string): string {
        return uuidv5(username + tag, this.NAMESPACE);
    }
}