const express = require("express");
const app = express();
const PORT = 3333;

const migrationsRun = require("./database/sqlite/migrations")

const router = require("./routes")

migrationsRun();

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Server live on Port ${PORT}`));