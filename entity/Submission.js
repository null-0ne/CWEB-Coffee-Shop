const { EntitySchema } = require("typeorm");

module.exports.Submission = new EntitySchema({
    name: "Submission",
    tableName: "submissions",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        userID: {
            type: "int"
        },
        formType: {
            type: "varchar2(20)"
        }
        message: {
            type: "text"
        },
        status: {
            type: "boolean"
        }
        respondedOn: {
            type: "timestamp"
        }
    }
})