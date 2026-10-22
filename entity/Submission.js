const { EntitySchema } = require("typeorm");

module.exports.Submission = new EntitySchema({
  name: "Submission",
  tableName: "submissions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
      nullable: true,
    },
    name: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      length: 255,
    },
    subject: {
      type: "varchar",
      length: 255,
    },
    message: {
      type: "text",
    },
    status: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    respondedOn: {
      type: "timestamp",
      nullable: true,
    },
  },
});
