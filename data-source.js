require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Review } = require("./entity/Review");


module.exports.AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql", // devcontainer use "mysql" - the service name in docker-compse.yml
    port: 3306,
    username: "root",
    password: "root",
    database: "cweb",
    synchronize: true,   // auto create tables
    logging: true,
    entities: [Review],
});