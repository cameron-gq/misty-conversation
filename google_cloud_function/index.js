const {GoogleAuth} = require('google-auth-library');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getAccessToken = (req, res) => {
  
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  
  const accessToken = auth.getAccessToken().then(responses => {
    console.log(`  AccessToken: ${responses}`);    
    var jsonResult = { 
      					"accessToken" : responses
                     };
    
     res.status(200).send(jsonResult);
  });

};


