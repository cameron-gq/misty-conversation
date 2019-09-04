# misty-conversation
This JavaScript Skill lives on the Misty robot and allows you to have a conversation with Misty. 

The skill uses Google DialogFlow so you can easily train Misty to recognize custom phrases and respond accordingly.

## Requirements
* Misty II robot
* Google Cloud account with free trial or billing enabled

## Video

## How it works


## Getting Started

### Create an Agent in DialogFlow
DialogFlow is powered by Google machine learning and makes it easy to create conversational interfaces by simply adding training phrases and fulfillment responses. We will use DialogFlow to take an audio recording from Misty, convert it to text, find an appropriate response based on the training phrases, and send an audio file of the response back to Misty.  
1. Go to [DialogFlow](https://dialogflow.com/) and sign in

1. Click "Create Agent", name it "Misty", choose "Create a new Google project" and click **Create** 

   <img src="/images/create_agent.png" alt="Create Agent" width="700">

1. Create a new intent and call it "misty.age"

1. Add Training phrases, Responses and click **Save**

   <img src="/images/age_intent.png" alt="Age Intent" width="700">

   NOTE: DialogFlow does NOT do a simple direct match to the Training phrases. Instead, it feeds the training phrases into a machine learning engine so that the intent will match on anything that's relatively close to the training phrases you enter.


### Create a Google Cloud Function
When you create an Agent in DialogFlow it automatically creates a corresponding Google Cloud Project and a Service Account to use for authenticating requests. To send requests to DialogFlow, we have to send along an Access Token for authorization. Access Tokens only last 1 hour so we have to retrieve them often. We could create a signed JWT in JavaScript as part of the Misty Skill and get the Access Token directly, but this seems way too complex. Instead, we will create a Google Cloud Function that returns an Access Token for our ProjectID whenever we need one.

1. Open Settings for your agent in DialogFlow

1. Click on your Project ID to open up Google Cloud Platform for your project

   <img src="/images/agent_settings.png" alt="Agent Settings" width="700">

1. Open Cloud Functions from the left side-panel

   <img src="/images/cloud_functions.png" alt="Cloud Functions" width="500">

1. Start a Free Trial of GCP if necessary

1. Click **Create function**

   <img src="/images/create_function.png" alt="Create Function" width="600">

1. Name your function "get-access-token"

   <img src="/images/access_token_function.png" alt="Access Token Function" width="500">

1. Copy the code below into the **index.js** window

      ```javascript
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
      ```
1. Copy the code below into the **package.json** window

      ```javascript
        {
            "name": "get-access-token",
            "version": "0.0.1",
            "dependencies": {
                "google-auth-library" : "^5.2.0"
            }
        }
      ```
1. Set the **Function to execute** to "getAccessToken"

1. Click "Create"


### Configure and Upload the Conversation Skill to Misty
1. Copy the Cloud Functions Trigger URL and set it as the `getAccessTokenUrl` in Conversation.json

   <img src="/images/trigger_url.png" alt="Trigger" width="500">

1. Copy the Project ID from DialogFlow and set it as the `projectId` in Conversation.json

   <img src="/images/project_id.png" alt="Trigger" width="700">

1. Upload Conversation.js and Conversation.json to Misty using the [Skill Runner](http://sdk.mistyrobotics.com/skill-runner/)

### Talk to Misty
1. Start the skill and say "Hey Misty"

1. Wait for the beep and then say "How old are you?"

1. Misty should respond with one of your phrases.


### Next Steps
1. Open your Agent in DialogFlow and add as many new Intents as you want!

   <img src="/images/joke.png" alt="Jokes" width="700">


