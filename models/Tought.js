const { DataTypes } = require("sequelize");
const db = require("../db/connection");

const User = require("./User");

const Tought = db.define("Toughts", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

// 1 pensamento pertence a um usuário (belongsTo)
Tought.belongsTo(User, { foreignKey: "userId" });
// 1 usuário tem muitos pensamentos (hasMany)
User.hasMany(Tought, { foreignKey: "userId" });

module.exports = Tought;
