const { EntitySchema } = require("typeorm");

module.exports.Order = new EntitySchema({
    name: "Order",
    tableName: "orders",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int"
        },
        orderDate: {
            type: "datetime",
            createDate: true
        },
        caterDate: {
            type: "datetime"

        },
        specialInstructions: {
            type: "varchar",
            length: 255,
            nullable: true
        },
        total: {
            type: "decimal",
            precision: 5,
            scale: 2
        }

    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "userId" },
        },
        orderItems: {
            target: "OrderItem",
            type: "one-to-many",
            inverseSide: "order"
        }
    },
});