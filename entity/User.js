const { EntitySchema } = require('typeorm');
const { GridFSBucketReadStream } = require('typeorm/driver/mongodb/typings.js');

module.exports.User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: 
    {
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
        birthDate:{
            type: 'date',
            nullable: true,
        },
        phoneNumber:{
            type: 'varchar',
            nullable: false
        }
    }
});