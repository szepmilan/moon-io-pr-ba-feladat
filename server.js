require("dotenv").config();
const express = require("express");
require("express-async-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const fs = require("fs").promises;
const date = require("date-and-time");
const chalk = require("chalk");
const AutoTester = require("./test/inject");

// Express app létrehozása
const app = express();

// Middleware, ami parse-olja a JSON adatokat a request body-ból
app.use(express.json());

// Routerek beállítása
app.use("/", require("./routers/main"));
app.use("/users",require("./routers/users"));
app.use("/parcels",require("./routers/parcels"));
// ...

// Végső middleware a default error handler felülírásához, így az nem
// HTML kimenetet fog adni, hanem JSON objektumot, továbbá egy log fájlba
// is beleírja a hibákat.
app.use(async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    await fs.appendFile(
        "error.log",
        [
            `[${date.format(new Date(), "YYYY. MM. DD. HH:mm:ss")}]`,
            "Name: " + err.name,
            "Message: " + err.message,
            "Stack:\n" + err.stack,
        ].join("\n") + "\n\n"
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
        errorDetails: {
            name: err.name,
            message: err.message,
            stack: [...err.stack.split("\n")],
        },
    });
});

// App indítása a megadott porton
(async () => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Az Express app fut: ${chalk.yellow(`http://127.0.0.1:${port}/graphql`)}`);

        // FONTOS! Erre szükség van, hogy az automata tesztelő megfelelően tudjon inicializálni!
        // Ehhez a sorhoz ne nyúlj a munkád közben: hagyd legalul, ne vedd ki, ne kommenteld ki,
        // különben elrontod az automata tesztelő működését!
        AutoTester.handleStart();
    });
})();
