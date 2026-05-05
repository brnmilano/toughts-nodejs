const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // toughts
  process.env.DB_USER, // root
  process.env.DB_PASSWORD, // (vazio)
  {
    host: process.env.DB_HOST, // localhost
    port: process.env.DB_PORT, // 3306
    dialect: process.env.DB_DIALECT, // mysql
  },
);

try {
  sequelize.authenticate();
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
} catch (error) {
  console.error(`Não foi possível conectar ao banco de dados: ${error}`);
}

module.exports = sequelize;
