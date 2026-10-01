const { EntitySchema } = require("typeorm");

module.exports.Menu = new EntitySchema({
    name: "MenuIttems",
    tableName: "menuItems",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        itemName: {
            type: "varchar",
            length: 255,
        },
    },
});
