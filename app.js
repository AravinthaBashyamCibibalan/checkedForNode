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

router.get('/checkAuth', (req,res) => {
    var config = {
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
         // 'Accept':'text/plain',
        }
      }
      
      var data = {
          client_id: '829302717389674993', //varEmail is a variable which holds the email
          client_secret: '829302717389674993',
          access_token: 'qdp0sey0az20tlsdh1hrgw5e#638047184957564843'
      }
      
      var url = 'https://azlor005.dxchealthlab.io/OIDCPortal/introspect';
      axios.post(url,querystring.stringify({
        client_id: '829302717389674993', //varEmail is a variable which holds the email
        client_secret: '829302717389674993',
        access_token: 'qdp0sey0az20tlsdh1hrgw5e#638047184957564843'
    }),config).then(response => {
        console.log('data::::::'+JSON.stringify(response.data));
        console.log(response);
        res.status(200).json(response.data);
      })
      .catch(error => {
        console.log(error);
        res.status(200).send({"error": true, "message": 'Unauthorized access.' })
      });
   
})

router.post('/login', (req,res) => {
    const postData = req.body;
    const user = {
        "email": postData.email,
        "name": postData.name
    }
    // do the database authentication here, with user name and password combination.
    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    const response = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
    }
    tokenList[refreshToken] = response
    res.status(200).json(response);
})

router.post('/token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
})

router.use(require('./tokenChecker'))

router.get('/secure', (req,res) => {
    // all secured routes goes here
    res.send('I am secured...')
})

app.use(bodyParser.json())
app.use('/api', router)
app.listen(config.port || process.env.port || 3000, () => {
    console.log(`Server is running on port ${config.port}.`);
  });
