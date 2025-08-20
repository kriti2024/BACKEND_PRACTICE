import router from './src/routes/index.js';
import express from 'express';


const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api", router)


app.listen(PORT, (error) => {
    if(!error)
        console.log("Server is working successfully" +PORT)

    else
        console.log("Error occurred, error");
})

