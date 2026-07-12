import { Request, Response } from "express";
import Endpoint from "./endpoint";

export default class WakeUp implements Endpoint {
    public path = "/wake-up";
    public method = "get";
    
    public async block(request: Request): Promise<void> {
        // This endpoint does not require any blocking logic, as the wake-up is handled in the callback.
    }

    public async callback(request: Request, response: Response): Promise<void> {
        response.status(200).send("Server is awake!");
    }
}