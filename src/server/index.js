const express = require('express');
const cors = require('cors');

const app = express();
const userRoutes = require('../routes/userRoutes.js')

//Middlewares
app.use(express.json());
app.use(cors())

//Routes
app.use('/api', userRoutes);


module.exports = app;


// https://sequelize.org/docs/v6/getting-started/

// * npm init -y 
// 1) npm install --save sequelize
// 2) npm install --save pg pg-hstore
// 3) npm install --save-dev sequelize-cli
// 4) npx sequelize-cli init   (config,models,migrations,seeders)
// 5) npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// 6) npx sequelize-cli model:generate --name Post --attributes title:string,description:string,user_id:string
