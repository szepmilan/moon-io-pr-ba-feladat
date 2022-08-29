const express = require("express");
const router = express.Router();

const models = require("../models");
const { sequelize } = require("../models");
const { Op, ValidationError } = require("sequelize");
const { User, Parcel} = models;

router.get("/",async(req,res)=>{
    const users = await User.findAll({
        attributes: {exclude: ['password']},//alapból se mutatja meg
    });
    res.send(users);
})

router.post("/", async (req, res) => {

    try {
        console.log(req.body.email_adress);
        const user = await User.create(req.body);
        console.log(req.body.email_adress);
        res.send(await User.findByPk(user.id,{
            attributes: {exclude: ['password']} ,
        }));
    } catch (e) {
        if (e instanceof ValidationError) {
            console.log(e);
            return res.sendStatus(400);
        }
        throw e;
    }
})

module.exports = router;
