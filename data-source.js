require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Menu } = require("./entity/Menu");



module.exports.AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql", // use "mysql" in devcontainer - service name in docker-compose.yml
    port: 3306,
    username: "root", // change according to your MySQL
    password: "root", // change according to your MySQL
    database: "cweb", // make sure this DB exists
    synchronize: true, // auto-create tables
    logging: false,
    entities: [Submission], //if the entity is not lsited in the array, then the table will not be created
});
