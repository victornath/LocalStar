import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDB.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./middleware/Errors.js";
import userRouter from "./routes/UserRoutes.js";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

app.use("/api/import", ImportData);
app.use("/api/users", userRouter);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`server running in port ${PORT}`));