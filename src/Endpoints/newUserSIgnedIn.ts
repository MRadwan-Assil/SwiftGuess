import * as Exception from "../exceptions";
import { Request, Response } from "express";
import Endpoint from "./endpoint";
import DatabaseManager from "../DataManager/databaseManager";
import ApiResponse from "../apiResponse";
import UUID from "../guid";

export type NewUserSignedInResponseDataType = {
    token_id: string;
}

export default class NewUserSignedIn implements Endpoint {
    public path = "/add-new-player";
    public method = "post";

    private validate(username: string, tag: string): void {
        const usernameRegex = /^[a-zA-Z0-9_ ]+$/;
        const tagRegex = /^[a-zA-Z0-9_]+$/;

        if (username.length > 16 || tag.length > 6 || tag.length < 3 || username.length < 4) {
            throw new Exception.UsernameOrTagIsTooShortOrTooBig();
        }

        if (!usernameRegex.test(username) || !tagRegex.test(tag)) {
            throw new Exception.BadRequest();
        }
    }

    public async block(request: Request): Promise<NewUserSignedInResponseDataType> {
        var data: NewUserSignedInResponseDataType = { token_id: "" };
        const { username, tag } = request.body;

        if (!request.body || typeof request.body !== "object") {
            throw new Exception.BadRequest();
        }

        if (typeof username !== "string" || typeof tag !== "string") {
            throw new Exception.BadRequest();
        }

        if (!username && !tag) {
            throw new Exception.UsernameAndTagRequired();
        }

        this.validate(username, tag);

        const tokenID = UUID.getTokenIDForPlayer(username, tag);


        if (await DatabaseManager.playersDataManager.isPlayerExists(tokenID)) {
            throw new Exception.PlayerAlreadyExists(username, tag);
        }

        await DatabaseManager.playersDataManager.addNewPlayer(username, tag);

        data.token_id = tokenID;
        return data;
    }

    public async callback(request: Request, response: Response): Promise<void> {
        var data: NewUserSignedInResponseDataType = { token_id: "" };
        var apiResponse: ApiResponse = new ApiResponse();

        try {
            data = await this.block(request);
            apiResponse.error = false;
            apiResponse.message = "added";
            apiResponse.status_code = 201;
            return;
        } catch (error) {
            apiResponse.error = true;

            if (error instanceof Exception.HttpError) {
                apiResponse.status_code = error.statusCode;
                apiResponse.message = error.message;
                return;
            }

            if (error instanceof Exception.PlayerAlreadyExists) {
                apiResponse.status_code = 409;
                apiResponse.message = error.message;
                return;
            }

            apiResponse.status_code = 500;
            apiResponse.message = JSON.stringify(error);
        } finally {
            response
                .status(apiResponse.status_code)
                .send(apiResponse.getResponse<NewUserSignedInResponseDataType>(data));
        }
    }
}
