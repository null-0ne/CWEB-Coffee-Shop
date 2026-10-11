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
        }
    },
    relations: {
        orders: {
            type: 'one-to-many',
            target: 'Order',
            inverseSide: 'user'
        }
    }
});

module.exports.Item = new EntitySchema({
    name: 'Item',
    tableName: 'items',
    columns: {
        id:{
            primary: true,
            type: 'int',
            generated: true
        },
        itemName: {
            type:'varchar',
            length: 255,
            unique: true
        },
        price: {
            type: 'decimal',
            precision: 10,
            scale: 2
        }
    },
    relations: {
        orderItems: {
            type: 'one-to-many',
            target: 'OrderItems',
            inverseSide: 'item'
        }
    }
});

module.exports.Order = new EntitySchema({
    name: 'Order',
    tableName: 'orders',
    columns: {
        id:{
            primary: true,
            type: 'int',
            generated: true
        },
        total:{
            type: 'decimal',
            precision: 10,
            scale: 2
        },
        date: {
            type: 'timestamp',
            createDate: true
        },
        userID: {
            type: 'int',
        }
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'userID'
            },
            inverseSide: 'orders'
        }
        ,
    orderItems: {
            type: 'one-to-many',
            target: 'OrderItems',
            inverseSide: 'order'
        },
    }
});

module.exports.OrderItems = new EntitySchema({
    name: 'OrderItems',
    tableName: 'orderItems',
    columns: {
        id:{
            primary: true,
            type: 'int',
            generated: true
        },
        orderID: {
            type: 'int'
        },
        itemID: {
            type: 'int'
        },
        quantity: {
            type: 'int'
        }
    },
    relations: {
        item: {
            type: 'many-to-one',
            target: 'Item',
            joinColumn: {
                name: 'itemID'
            },
            inverseSide: 'orderItems'
        },
        order: {
            type: 'many-to-one',
            target: 'Order',
            joinColumn: {
                name: 'orderID'
            },
            inverseSide: 'orderItems'
        }
    }
})