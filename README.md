# misty-conversation
This JavaScript Skill lives on the Misty robot and allows you to have a conversation with Misty. 

The skill uses Google DialogFlow so you can easily train Misty to recognize custom phrases and respond accordingly.

## Requirements
* Misty II robot
* Google Cloud account with free trial or billing enabled

## Video
[![](http://img.youtube.com/vi/5mBCmfMfxTE/0.jpg)](http://www.youtube.com/watch?v=5mBCmfMfxTE "Misty Conversation Demo Video")

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


### Get Credentials for the Service Account in Google Cloud
When you create an Agent in DialogFlow it automatically creates a corresponding Google Cloud Project and a Service Account to use for authenticating requests. To send requests to DialogFlow, we have to send along an Access Token for authorization. Access Tokens only last 1 hour so we have to retrieve them often. We must download credentials for the Service Account to use in our request for an Access Token. We will create a signed JWT in JavaScript as part of the Misty Skill and request the Access Token directly.

1. Open Settings for your agent in DialogFlow

1. Click on the Service Account link

   <img src="/images/service_account.png" alt="Service Account" width="700">

1. Open the menu for the Service Account named "DialogFlow Integrations" and choose "Create Key"

   <img src="/images/create_key.png" alt="Create Key" width="700">

1. Choose JSON for the key type and click "Create". A JSON file will automatically download to your computer.

   <img src="/images/save_json.png" alt="Save JSON" width="500">

1. Open the JSON file and copy **project_id**, **private_key_id**, **private_key**, and **client_email** into "Conversation.json"

### Upload the Conversation Skill to Misty
1. Upload Conversation.js and Conversation.json to Misty using the [Skill Runner](http://sdk.mistyrobotics.com/skill-runner/)

### Talk to Misty
1. Start the skill and say "Hey Misty"

1. Wait for the beep and then say "How old are you?"

1. Misty should respond with one of your phrases.


### Next Steps
1. Open your Agent in DialogFlow and add as many new Intents as you want!

   <img src="/images/joke.png" alt="Jokes" width="700">


