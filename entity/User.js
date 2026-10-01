const { EntitySchema } = require('typeorm');

module.exports.User = new EntitySchema({
    name: 'User',
    tableName: 'user',
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
            legnth: 255
        }
    }
})