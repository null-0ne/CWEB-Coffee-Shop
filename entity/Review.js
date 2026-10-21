const { EntitySchema } = require("typeorm");

module.exports.Review = new EntitySchema({
    name: "Review",
    tableName: "reviews",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        userId:{
            type: "int",
            nullable : false
        },
        rating: {
            type: "int",
            nullable : false

        },
        review: {
            type: "varchar",
            nullable : false
        },
        visitDate: {
            type: "date",
            nullable: false,
        },
        reviewDate: {
            type: "timestamp",
            createDate: true
        }

        
    }
});