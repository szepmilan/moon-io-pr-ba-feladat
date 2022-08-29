const express = require("express");
const router = express.Router();

const { faker } = require("@faker-js/faker");
const models = require("../models");
const { sequelize } = require("../models");
const { Op, ValidationError } = require("sequelize");
const { User, Parcel} = models;

router.get("/:id",async(req,res)=>{
    let parcel = await Parcel.findByPk(req.params.id);
    if (!parcel) return res.sendStatus(404);
    const parcel_id = await Parcel.findByPk(req.params.id,{
        include: [{ model: User, as: "user", attributes: {exclude: ['password']} }],
    });
    res.send(parcel_id);
})

router.post("/", async (req, res) => {
    const size = req.body.size;
    const user_id = req.body.user_id;
    const user = await User.findByPk(user_id);
    const meretek = ["X","M","L","XL"];
    if (!user) return res.sendStatus(404);
    try {
        if (meretek.includes(size)) {
            const parcel =await user.createParcel({
                parcel_number: faker.unique(() => faker.random.alphaNumeric(faker.datatype.number({min:10,max:10}))),
                size: size,
                UserId: user_id,
            });
            //parcel.setUser(await Parcel.findByPk(user_id));

            res.send(await Parcel.findByPk(parcel.id,{
                include: [{ model: User, as: "user", attributes: {exclude: ['password']} }],
            }));
        } else {
            return res.sendStatus(403);
        }
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.sendStatus(400);
        }
        throw e;
    }
});

module.exports = router;
