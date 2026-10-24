const { EntitySchema } = require("typeorm");

module.exports.Menu = new EntitySchema({
  name: "Menu",
  tableName: "menu",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
      nullable: false,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    category: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    createDate: {
      type: "timestamp",
      createDate: true,
    },
    price: {
      type: "decimal",
      nullable: false,
    },
  },
});
