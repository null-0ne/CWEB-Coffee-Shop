const { EntitySchema } = require('typeorm');

module.exports.Showcase = new EntitySchema({
    name: 'Showcase',
    tableName: 'Showcase',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        title: {
            type: 'varchar',
            length: 255,
        },
        fileName: {
            type: 'varchar',
            length: 255,
        },
        mimeType: {
            type: 'varchar',
            length: 50,
        },
        size: {
            type: 'int',
        },
        uploadedBy : {
            type: 'varchar',
            length:255,
        },
        uploadedAt : {
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