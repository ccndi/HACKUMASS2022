const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const fs = require('fs')
let correctSong = "";
const songs = new Map();
songs.set("All I Want For Christmas", "https://songshackumass.s3.amazonaws.com/All+I+Want+For+Christmas.mp3")
songs.set("Anti-Hero", "https://songshackumass.s3.amazonaws.com/Anti-Hero.mp3")
songs.set("Attention", "https://songshackumass.s3.amazonaws.com/Attention.mp3")
songs.set("Baby One More Time", "https://songshackumass.s3.amazonaws.com/Baby+One+More+Time.mp3")
songs.set("Cotton Eye Joe", "https://songshackumass.s3.amazonaws.com/Cotton+Eye+Joe.mp3")
songs.set("Despacito", "https://songshackumass.s3.amazonaws.com/Despacito.mp3")
songs.set("Dynamite", "https://songshackumass.s3.amazonaws.com/Dynamite.mp3")
songs.set("Gangsta's Paradise", "https://songshackumass.s3.amazonaws.com/Gangsta's+Paradise.mp3")
songs.set("Glimpse Of Us", "https://songshackumass.s3.amazonaws.com/Glimpse+of+Us.mp3")
songs.set("When I Was Your Man", "https://songshackumass.s3.amazonaws.com/When+I+was+Your+Man.mp3")


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  //twiml.say({ voice: 'alice' }, 'hello sarah this is andrew speaking');
  let data = fs.readFileSync('songs_so_far.txt', {encoding:'utf8', flag:'r'});
  const seen_so_far = data.split(" ");
  let songIndex = Math.floor(Math.random() * songs.size);
  while (seen_so_far.includes[songIndex.toString()]) {
    songIndex = Math.floor(Math.random() * songs.size);
  }
  data = data + songIndex.toString() + " ";
  fs.writeFileSync('songs_so_far.txt', data);
  correctSong = Array.from(songs.keys())[songIndex];
  let songLink = songs.get(correctSong);
  twiml.play({
      loop: 10
  }, songLink);

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');

  const accountSid = 
  const authToken = 
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: 'Type the name of the song you just listened to',
      from: '+17088346083',
      to: '+15086540643'
    })
    .then(message => console.log(message.sid))

  response.send(twiml.toString());
  
});

//used to handle the person's text response
app.post('/sms', (request, response) => {
  const twiml = new MessagingResponse();
  let cur_num_correct = 0;
  let data = fs.readFileSync('tracker.txt', {encoding:'utf8', flag:'r'});
  cur_num_correct = data;
  let song = request.body.Body
  //should log an integer on console
  if (song.toUpperCase() === correctSong.toUpperCase()) {
    cur_num_correct++;
    if (cur_num_correct === 3) {
      twiml.message('Congrats! You answered 3 songs in a row correctly.')
      cur_num_correct = 0
      let data = cur_num_correct.toString();
      fs.writeFileSync("tracker.txt", data)
      fs.writeFileSync("songs_so_far.txt", "");
    } 
    else {
      twiml.message('You got the right song :D, call again to try and get three in a row');
      let data = cur_num_correct.toString();
      fs.writeFileSync("tracker.txt", data);
    }
  }
  else {
    twiml.message("Sorry! You did not guess the right song! Game over D:")
    cur_num_correct = 0;
    let data = cur_num_correct.toString();
    fs.writeFileSync("tracker.txt", data);
    fs.writeFileSync("songs_so_far.txt", "");
  }
  response.type('text/xml').send(twiml.toString());  
});
// Create an HTTP server and listen for requests on port 3000
app.listen(3000, () => {
  console.log(
    'Now listening on port 3000. ' +
    'Be sure to restart when you make code changes!'
  );
});
