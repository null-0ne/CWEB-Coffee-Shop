require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Submission } = require("./entity/Submission");
const { User } = require("./entity/User");
const { StoreInformation } = require("./entity/StoreInformation");

module.exports.AppDataSource = new DataSource({
  type: "mysql",
  host: "mysql", // use "mysql" in devcontainer - service name in docker-compose.yml
  port: 3306,
  username: "root", // change according to your MySQL
  password: "root", // change according to your MySQL
  database: "cweb", // make sure this DB exists
  synchronize: true, // auto-create tables
  logging: false,
  entities: [User, Submission, StoreInformation], //if the entity is not lsited in the array, then the table will not be created
});
