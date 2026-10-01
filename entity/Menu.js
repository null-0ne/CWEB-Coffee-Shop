const { EntitySchema } = require('typeorm');

module.exports.Menu = new EntitySchema({
    name: 'Menu',
    tableName: 'Menu',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        firstName: {
            type: 'varchar',
            length: 255,
        },
        lastName: {
            type: 'varchar',
            length: 255,
        },
        age: {
            type: 'int',
        },
    },
});