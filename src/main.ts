import * as Exception from "./exceptions";
import ExpressManager from "./expressManager";
import SocketIOManager from "./socketIOManager";
import NewUserSignedIn from "./Endpoints/newUserSIgnedIn";
import DatabaseManager from "./DataManager/databaseManager";

async function main(): Promise<void> {
    const port: number = 8081;
    const expressManager: ExpressManager = new ExpressManager(port);
    const socketIOManager: SocketIOManager = new SocketIOManager(expressManager.getApp());

    await DatabaseManager.connectToDatabase();
    await DatabaseManager.initialize();

    expressManager.addEndpoint(new NewUserSignedIn());
    expressManager.useFilter();
    expressManager.listen((error?: Error) => {
        if (error) throw new Exception.ServerFailedToStart(error.message);
        console.warn(`using port ${port}`)
    });
}

export default main;