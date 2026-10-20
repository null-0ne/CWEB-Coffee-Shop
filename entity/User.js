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
            length: 255,
            nullable: false
        },
        password:{
            type: 'varchar',
            length: 255,
            nullable: false
        },
        firstName: {
            type: 'varchar',
            length: 30,
            nullable: false
        },
        lastName: {
            type: 'varchar',
            length: 50,
            nullable: false
        }
    }
});