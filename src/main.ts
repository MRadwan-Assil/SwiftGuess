import * as Exception from "./exceptions";
import ExpressManager from "./expressManager";
import SocketIOManager from "./socketIOManager";
import NewUserSignedIn from "./Endpoints/newUserSIgnedIn";
import DatabaseManager from "./DataManager/databaseManager";
import * as dotenv from "dotenv";
import DownloadDatabase from "./Endpoints/downloadDatabase";
import WakeUp from "./Endpoints/wakeUp";

async function main(): Promise<void> {
    dotenv.config();

    const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8081;
    const expressManager: ExpressManager = new ExpressManager(port);
    const socketIOManager: SocketIOManager = new SocketIOManager(expressManager.getApp());

    await DatabaseManager.connectToDatabase();
    await DatabaseManager.initialize();

    expressManager.addEndpoint(new DownloadDatabase());
    expressManager.addEndpoint(new NewUserSignedIn());
    expressManager.addEndpoint(new WakeUp());

    expressManager.useFilter();
    expressManager.listen((error?: Error) => {
        if (error) throw new Exception.ServerFailedToStart(error.message);
        console.warn(`using port ${port}`);
        startWakeUpInterval();
    });
}

function startWakeUpInterval(): void {
    const url = "https://swiftguess.onrender.com/wake-up";
    const TEN_MINUTES = 10 * 60 * 1000;

    console.log("Wake-up timer başlatıldı. Her 10 dakikada bir istek atılacak.");

    setInterval(async () => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(`[${new Date().toISOString()}] Wake-up isteği başarılı.`);
            } else {
                console.error(`[${new Date().toISOString()}] Wake-up isteği başarısız oldu. Durum kodu: ${response.status}`);
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Wake-up isteği atılırken hata oluştu:`, error);
        }
    }, TEN_MINUTES);
}

export default main;