const { EntitySchema } = require('typeorm');

module.exports.User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id:{
            primary: true,
            type: 'int',
            generated: true
        },
        userName: {
            type: 'varchar',
            length: 255
        },
        email:{
            type: 'varchar',
            length: 255
        },
        password:{
            type: 'varchar',
            length: 255
        },
        firstName: {
            type: 'varchar',
            length: 30
        },
        lastName: {
            type: 'varchar',
            length: 50
        }
    }
});