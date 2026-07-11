import { PlayerAlreadyExists } from "../exceptions";
import UUID from "../guid";
import SQLManager from "./sqlManager";

export type Player = {
    username: string;
    tag: string;
    token_id: string;
}

export default class PlayersDataManager {
    private tableName: string = "players";
    public sqlManager: SQLManager;

    public constructor(sqlManager: SQLManager) {
        this.sqlManager = sqlManager;
    }
    
    public async createPlayersTable(): Promise<void> {
        await this.sqlManager.createPlayersTable();
    }

    public async isPlayerExists(tokenID: string): Promise<boolean> {
        return await this.sqlManager.isRowExists(this.tableName, { token_id: tokenID });
    }

    public async addNewPlayer(username: string, tag: string): Promise<string> {
        const token_id: string = UUID.getTokenIDForPlayer(username, tag);
        await this.sqlManager.addRowToTable(this.tableName, <Player>{ username, tag, token_id });
        return token_id;
    }

    public removePlayer(tokenID: string): void {
    }
}