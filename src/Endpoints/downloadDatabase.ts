import { Request, Response } from "express";
import Endpoint from "./endpoint";
import path from "node:path";
import fs from "node:fs";

export default class DownloadDatabase implements Endpoint {
    public path = "/download-database";
    public method = "get";

    public async block(request: Request): Promise<void> {
        // This endpoint does not require any blocking logic, as the download is handled in the callback.
    }

    public async callback(request: Request, response: Response): Promise<void> {
        const password = request.query.password;

        if (password !== process.env.ADMIN_PASSWORD) {
            response.status(403).send("Forbidden");
            return;
        }

        const dbPath = path.join(process.cwd(), "database.db");

        console.log("Database download requested by admin.");

        response.download(dbPath);
    }
}