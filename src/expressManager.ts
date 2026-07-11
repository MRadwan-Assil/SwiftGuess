import express, { Express, Request, Response, NextFunction } from "express";
import Endpoint from "./Endpoints/endpoint";
import * as Exception from "./exceptions";

export default class ExpressManager {
    private app: Express;
    private port: number;

    public getApp(): Express {
        return this.app;
    }

    public constructor(port: number) {
        this.app = express();
        this.port = port;
        this.app.use(express.json());
    }

    public addEndpoint(endpoint: Endpoint) {
        const method = endpoint.method.toLowerCase();
        const callback = endpoint.callback.bind(endpoint);

        if (typeof (this.app as any)[method] === 'function') {
            (this.app as any)[method](endpoint.path, callback);
        } else {
            throw new Exception.UnsupportedOrInvalidHTTPMethod(method);
        }
    }

    public useFilter() {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof SyntaxError &&
                "status" in err &&
                err.status === 400 &&
                "body" in err
            ) {
                return res.status(400).json({ status: "error", message: "Bad request" });
            }
            next();
        });
    }

    public listen(callback: (error?: Error) => void) {
        this.app.listen(this.port, callback);
    }
}
