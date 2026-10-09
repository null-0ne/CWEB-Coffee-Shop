const { DataTypes } = require("sequelize");
const sequelize = require("./database");

// Define the User model. Sequelize will turn this into a table named "Users".
// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
module.exports = sequelize.define("Review", {
  // id: {
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4, //Or DataTypes.UUIDV1
  //   primaryKey: true,
  // },
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  review: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: true},
  //created: { type: DataTypes.DATE, defaultValue : Date.now }
});
