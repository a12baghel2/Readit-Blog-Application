// Imports
const  express = require('express');
const app = express();

app.get('/', (req,res) => {
    res.send("Hello Web");
});

app.get('/:name', (req,res) => {
    res.send(`hello ${req.params.name}`);
});

app.listen(5000, () => {
    console.log("server started pooling 5000....");
})