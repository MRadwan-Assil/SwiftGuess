import { Request, Response } from "express";

export default abstract class Endpoint {
    abstract path: string;
    abstract method: string;
    abstract block(request: Request): unknown;
    abstract callback(request: Request, response: Response): void;
}