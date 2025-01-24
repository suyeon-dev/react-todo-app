const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

console.log(config);
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// model 추가
db.Todo = require('./Todo')(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; //
