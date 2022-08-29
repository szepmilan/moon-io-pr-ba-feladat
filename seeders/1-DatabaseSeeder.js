"use strict";

// Faker dokumentáció, API referencia: https://fakerjs.dev/guide/#node-js
const { faker } = require("@faker-js/faker");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const models = require("../models");
const {User, Parcel} = models;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Ide dolgozd ki a seeder tartalmát:
            // ...

            const users = [];
            const usersCount = faker.datatype.number({ min: 5, max: 10 });

            for (let i = 0; i < usersCount; i++) {
                let isNull_Phone=[faker.phone.imei(),null];
                users.push(
                    await User.create({
                        email_address: faker.internet.email(),
                        password: bcrypt.hashSync(faker.lorem.word(), bcrypt.genSaltSync(12)),
                        first_name: faker.name.findName(),
                        last_name: faker.name.lastName(),
                        phone_number: faker.helpers.arrayElement(isNull_Phone)
                    })
                );
            }

            const parcels = [];
            const parcelCount = faker.datatype.number({ min: 5, max: 10 });

            for (let i = 0; i < parcelCount; i++) {
                const parcel = await Parcel.create({
                    parcel_number: faker.unique(() => faker.random.alphaNumeric(faker.datatype.number({min:10,max:10}))),
                    size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                    UserId: faker.helpers.arrayElement(users).id,
                });
                console.log(parcel.UserId);
                parcels.push(parcel);
                console.log(parcel);
                console.log("vége");
                console.log(users[parcel.UserId-1]);
                await parcel.setUser(users[parcel.UserId-1]);
            }

            console.log(chalk.green("A DatabaseSeeder lefutott"));
        } catch (e) {
            // Ha a seederben valamilyen hiba van, akkor alapértelmezés szerint elég szegényesen írja
            // ki azokat a rendszer a seeder futtatásakor. Ezért ez Neked egy segítség, hogy láthasd a
            // hiba részletes kiírását.
            // Így ha valamit elrontasz a seederben, azt könnyebben tudod debug-olni.
            console.log(chalk.red("A DatabaseSeeder nem futott le teljesen, mivel az alábbi hiba történt:"));
            console.log(chalk.gray(e));
        }
    },

    // Erre alapvetően nincs szükséged, mivel a parancsok úgy vannak felépítve,
    // hogy tiszta adatbázist generálnak, vagyis a korábbi adatok enélkül is elvesznek
    down: async (queryInterface, Sequelize) => {},
};
