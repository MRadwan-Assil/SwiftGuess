import { ExecException } from "node:child_process";
import PlayersDataManager from "./playerDataManager";
import SQLManager from "./sqlManager";
import { DatabaseIsNULL } from "../exceptions";

export default class DatabaseManager {
    private static sqlManager: SQLManager = new SQLManager();
    public static playersDataManager: PlayersDataManager = new PlayersDataManager(this.sqlManager);

    public static async initialize(): Promise<void> {
        await this.playersDataManager.createPlayersTable();
    }

    public static async connectToDatabase(): Promise<void> {
        try {
            await this.sqlManager.connect();
        } catch (error) {
            if (error instanceof DatabaseIsNULL) {
                console.log(error.message);
                console.log("Please initialize .db");
                return;
            }

            console.log(error);
        }
    }
}
