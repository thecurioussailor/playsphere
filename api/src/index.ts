import express from "express";
import routes from "./routes/routes"
const app = express();

app.use(express.json());

app.use("/api", routes);


const port = process.env.PORT;
app.listen(port, () => {
    console.log("server is listening on port" + port)
});