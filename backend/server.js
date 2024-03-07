import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { database_connection } from './config/DB_connection.js'
import { router } from './routes/UserRouter.js'
import { NotFoundMiddleware } from './middlewares/NotFound.js'
import { ErrorHandler } from './middlewares/ErrorHandler.js'
dotenv.config()
const app = express()


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api/auth', router)

app.use(NotFoundMiddleware)
app.use(ErrorHandler)

const start = async () => {
    await database_connection(process.env.DB_CONNECTION);
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}
start()


