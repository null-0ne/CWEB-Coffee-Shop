const { EntitySchema } = require("typeorm");

module.exports.StoreInformation = new EntitySchema({
  name: "StoreInformation",
  tableName: "store_information",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    category: {
      type: "varchar",
      length: 50,
    },
    label: {
      type: "varchar",
      length: 100,
    },
    value: {
      type: "varchar",
      length: 255,
    },
    displayOrder: {
      type: "int",
    },
  },
});
