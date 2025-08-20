import router from './routes/index';
import express, {Application} from 'express';


const app: Application = express();
app.use(express.json());

const PORT: number = 3000;

app.use("/api", router);


app.listen(PORT, (error?:any) => {
    if(!error) {
        console.log("Server is working successfully" +PORT);
    }

    else{
        console.log("Error occurred", error);
    }
});

