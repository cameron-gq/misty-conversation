/*
 *  MIT License
 *
 *
 *  Copyright (c) 2019 Cameron Henneke
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
*/

GetAccessToken();


/* 
 * Gets a current accessToken to use for accessing the DialogFlow API. Access Tokens expire
 * after 1 hour, so a fresh one is obtained every time the skill starts.
 */
function GetAccessToken() {

    misty.SendExternalRequest("POST",  _params.getAccessTokenUrl, null, null, null, false, false, null, "application/json", "SetAccessToken");

}

/* 
 * Stores the access token for use later with the DialogFlow API.
 * Starts listening for user voice input.
 */
function SetAccessToken(data) {

    let response = JSON.parse(data.Result.ResponseObject.Data)
    //misty.Debug("getAccessToken response: " + JSON.stringify(response));

    misty.Set("googleAccessToken", response.accessToken);

    StartListening();
}

/*
 * Activates key phrase recognition
 */
function StartListening() {

    misty.StartKeyPhraseRecognition();
    misty.RegisterEvent("KeyPhraseRecognized","KeyphraseRecognized", 10, false);
    misty.Debug("Misty is listening and will beep when she hears 'Hey Misty'.");

}

/* 
 * Plays a sound and changes LED colors to signal recording. Gets the audio file 
 * when done recording for processing.
 */
function _KeyPhraseRecognized() {

    let audioFileName = "temp_input_audio.wav";

    misty.PlayAudio("002-Weerp.wav", 100);

    misty.StartRecordingAudio(audioFileName);
    misty.ChangeLED(28, 230, 7); //green

    misty.Pause(4000);

    misty.StopRecordingAudio();
    misty.ChangeLED(224, 12, 12); // red

    misty.GetAudioFile(audioFileName, "ProcessAudioFile");

}

/* 
 * Sends the audio file as Base64 to the DialogFlow project where speech-to-text
 * is used to determine what the person said, match it with an intent, and then
 * send back an appropriate audio response using text-to-speech.
 */
function ProcessAudioFile(data) {

    // start listening again while processing audio and responding
    StartListening();

    //misty.Debug(JSON.stringify(data));

    let base64 = data.Result.Base64;

    let sessionId = getSessionId();
	let url = "https://dialogflow.googleapis.com/v2/projects/" + _params.projectId + "/agent/sessions/" + sessionId + ":detectIntent";
    let authorizationType =  "Bearer";

    var dialogFlowParams = JSON.stringify({
        "queryInput": {
            "audioConfig": {
                "audioEncoding": "AUDIO_ENCODING_LINEAR_16",
                "languageCode": "en-US",
                "sampleRateHertz": 48000
            }
        },
        "inputAudio": base64,
        outputAudioConfig: {
            audioEncoding: "OUTPUT_AUDIO_ENCODING_LINEAR_16",
            "synthesizeSpeechConfig": {
                "speakingRate": 1,
                "pitch": 5,
                "volumeGainDb": 0,
                "effectsProfileId": [],
                "voice": {
                    "name": "en-US-Wavenet-C",
                    "ssmlGender": "SSML_VOICE_GENDER_FEMALE"
                }
            }
        }
    });

    let accessToken = misty.Get("googleAccessToken");

    misty.SendExternalRequest("POST", url, authorizationType, accessToken, dialogFlowParams, false, false, null, "application/json", "ProcessDialogFlowResponse");

}


/* 
 * Get the audio response from DialogFlow, save it to Misty and play immediately
 */
function ProcessDialogFlowResponse(data) {

    let response = JSON.parse(data.Result.ResponseObject.Data)

    misty.Debug("DialogFlow response: " + JSON.stringify(response));
    misty.Debug("Input text: " + response.queryResult.queryText);
    misty.Debug("Ouput text: " + response.queryResult.fulfillmentText);

    let audioData = response.outputAudio;

    misty.ChangeLED(0, 173, 239); // blue

    // this skill seems to be more reliable when we cycle through 
    // different audio files instead of using the same one each time
    let outputFilename = getRandomInt(50) + "_temp_output_audio.wav";

    misty.SaveAudio(outputFilename, audioData, true, true);

}


function getSessionId(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


