import express, { Request, Response } from 'express';
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from './routes/users';
import indexRouter from './routes/index';
import {db} from './config';

//Sequelize connection (to connect to the database)
db.sync().then(() => {
    console.log("Database connected")
}).catch(err => {
    console.log(err)
});

// const dbconnect =async () => {
//    let data = await db.sync()
//    if(data){
//     console.log("Database connected")}
//     return }

//     dbconnect()

const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());


//Router middleware
//root routes
app.use('/', indexRouter)
app.use('/users', userRouter)

// app.get('/about', (req: Request, res:Response) => {
//     res.status(200).json({message: "Hello World"})
// });


//configure a server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



export default app;