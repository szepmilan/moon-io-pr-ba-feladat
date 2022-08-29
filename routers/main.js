const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const authMiddleware = require('../middlewares/auth');
const { Sequelize, sequelize, /* ... további modellek importálása itt */ } = require("../models");
const { ValidationError, DatabaseError, Op } = Sequelize;

// http://127.0.0.1:4000/
router.get("/", async (req, res) => {
    res.send({ message: "Gyökér végpont" });
    // * A send alapból 200 OK állapotkódot küld, vagyis az előző sor ugyanaz, mint a következő:
    // res.status(StatusCodes.OK).send({ message: "Gyökér végpont" });
});

// http://127.0.0.1:4000/hello-world
router.get("/hello-world", async (req, res) => {
    res.send({ message: "Helló Világ!" });
});

module.exports = router;
