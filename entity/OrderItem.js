const { EntitySchema } = require("typeorm");

module.exports.OrderItem = new EntitySchema({
    name: "OrderItem",
    tableName: "order_items",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        orderId: {
            type: "int"
        },
        menuId: {
            type: "int"
        },
        quantity: {
            type: "int"
        },
        unitPrice: {
            type: "decimal",
            precision: 5,
            scale: 2
        }

    },
    relations: {
        order: {
            target: "Order",
            type: "many-to-one",
            joinColumn: { name: "orderId" },
        },
        menu: {
            target: "Menu",
            type: "many-to-one",
            joinColumn: { name: "menuId"}
        }
    },
});