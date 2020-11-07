const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
require('./database');

const app = express();

//configs
app.use(express.json());//pra api saber lidar com requisições que venham no formato de json
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(routes);

//start the server
app.listen(process.env.PORT || 3333, function () {
    console.log(`Servidor rodando na url ${process.env.API_URL}`);
});

/*
developed by DIEGO ALVES BITTENCOURT
github.com/DiegoDevBittencourt
instagram.com/diegodevbittencourt
whatsapp: 44 99754-0957
diegodev6d@gmail.com
*/
