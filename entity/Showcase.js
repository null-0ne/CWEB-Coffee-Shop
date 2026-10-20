const { EntitySchema } = require('typeorm');

module.exports.Showcase = new EntitySchema({
    name: 'Showcase',
    tableName: 'showcase',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        title: {
            type: 'varchar',
            length: 60,
        },
        fileName: {
            type: 'varchar',
            length: 255,
        },
        userId : {
            type: 'int',
        },
        uploadDate : {
            type: 'datetime',
            createDate: true,
        },
        description : {
            type: 'varchar',
            length: 255,
            nullable: true
        }
    },
});