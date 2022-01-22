import express, {Request, Response} from 'express'
var cors = require('cors')

import dotenv from "dotenv";
import router from './routes';
dotenv.config();
const PORT= process.env.PORT

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
app.use(router)


app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
})