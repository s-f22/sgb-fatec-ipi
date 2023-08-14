const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express();
app.use(bodyParser.json())

app.post('/eventos', (req, res) => {

  const evento = req.body;

  axios.post('http://localhost:4001/eventos', evento);
  
  axios.post('http://localhost:4002/eventos', evento);
  
  axios.post('http://localhost:4101/eventos', evento);
  res.status(200).send({msg: "OK"});

})

app.listen(4100, () => {
  console.log("eventos: 4100")
})

