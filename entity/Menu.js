const { EntitySchema } = require("typeorm");

module.exports.Menu = new EntitySchema({
    name: "Menu",
    tableName: "Menu",
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
        type: {
            type: "varchar",
            length: 255,
        }
    },
});
