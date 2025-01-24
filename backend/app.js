// -- Active: 1732688614857@@127.0.0.1@3306@sesac
const express = require('express');
const app = express();
const PORT = 8080;
const { sequelize } = require('./models');
const indexRouter = require('./routes');
const serverPrefix = '/api-server';
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// /api-server
app.use(serverPrefix, indexRouter);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log('database sync 오류!!');
  });
