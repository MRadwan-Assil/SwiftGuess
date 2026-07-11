import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { DatabaseIsNULL, ErrorAddingNewRowToTable } from '../exceptions';
import path from 'path';

export default class SQLManager {
    private database: Database<sqlite3.Database, sqlite3.Statement> | null = null;

    public async connect(): Promise<void> {
        this.database = await open({
            filename: './database.db',
            driver: sqlite3.Database,
        });
    }

    public async createPlayersTable() {
        if (!this.database) {
            throw new DatabaseIsNULL();
        }

        await this.database.exec(`
            CREATE TABLE IF NOT EXISTS players (
                username TEXT NOT NULL,
                tag TEXT NOT NULL,
                token_id TEXT NOT NULL UNIQUE,
                PRIMARY KEY (username, tag)
            );
        `);
    }

    public async isRowExists(tableName: string, criteria: Record<string, any>): Promise<boolean> {
        const columns = Object.keys(criteria);
        if (columns.length === 0) return false;
        const whereClause = columns.map(col => `${col} = ?`).join(' AND ');
        const sql = `SELECT 1 FROM ${tableName} WHERE ${whereClause} LIMIT 1`;
        const values = Object.values(criteria);
        const row = await this.database!.get(sql, values);
        return !!row;
    }

    public async addRowToTable(tableName: string, criteria: Record<string, any>): Promise<boolean> {
        const columns = Object.keys(criteria);
        if (columns.length === 0) return false;
        const columnNames = columns.join(', ');
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
        const values = Object.values(criteria);

        try {
            await this.database!.run(sql, values);
            return true;
        } catch (error) {
            console.log(error);
            throw new ErrorAddingNewRowToTable(tableName);
        }
    }

    public async closeDatabase(): Promise<void> {
        await this.database!.close();
    }
}