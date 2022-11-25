const jwt = require('jsonwebtoken')
const config = require('./config')
const axios = require('axios');
const querystring = require('querystring');

module.exports = (req,res,next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

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
    if(response && response.data && response.data==true){
      next();
    }else{
      res.status(200).json(response.data);
    }
    
  })
  .catch(error => {
    console.log(error);
    res.status(200).send({"error": true, "message": 'Unauthorized access.' })
  });


  // decode token
  /*
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
  */
}