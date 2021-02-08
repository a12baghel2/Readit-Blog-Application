const express = require('express')

const route = express.Router();

route.get('/', (req,res) => {
    res.send("You are on article route");
})

module.exports = route;