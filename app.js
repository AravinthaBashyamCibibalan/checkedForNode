const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
const config = require('./config')
const tokenList = {}
const app = express()
const axios = require('axios');
const querystring = require('querystring');
router.get('/', (req,res) => {
    res.send('Ok');
})

router.get('/secure', (req,res) => {
    // all secured routes goes here
    res.send('I am secured...')
})

app.use(bodyParser.json())
app.use('/api', router)
app.listen(process.env.port || 3000, () => {
    console.log(`Server is running on port ${config.port}.`);
  });
