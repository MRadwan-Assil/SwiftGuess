import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export default class SocketIOManager {
    private server;
    private io: Server;
    private cors: object;

    constructor(app: Express) {
        this.server = createServer(app);
        this.cors = { cors: { origin: "*" } }
        this.io = new Server(this.server, this.cors);
    }

    public listen(): void {

    }
}