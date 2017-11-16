const express = require("express");
const app = express();
const stockService = require("../src/stock-service");
app.get('/stock/:number/range/:range', (req,res) => {

})