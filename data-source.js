require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Menu } = require("./entity/Menu");
const { User } = require("./entity/User");
const { Showcase } = require("./entity/Showcase");
const { Submission } = require("./entity/Submission");
const { Review } = require("./entity/Review");



module.exports.AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql", // use "mysql" in devcontainer - service name in docker-compose.yml
    port: 3306,
    username: "root", // change according to your MySQL
    password: "root", // change according to your MySQL
    database: "cweb", // make sure this DB exists
    synchronize: true, // auto-create tables
    logging: false,
    entities: [User, Menu, Showcase, Submission, Review], //if the entity is not lsited in the array, then the table will not be created
});
