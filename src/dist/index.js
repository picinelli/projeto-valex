import express from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import errorHandler from "./middlewares/errorHandler.js";
var app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandler);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("Servidor ligado on port ".concat(PORT));
});
