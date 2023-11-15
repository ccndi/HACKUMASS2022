We used Twilio’s API to build a phone-call music game The goal of the game is to guess the song 3 times in a row

After calling the number provided on the website, a song will be played. The player will then have to end the call and they will receive a text from the number asking for their guess. If the player guesses correctly, they will be able to call the number and play the game again. Once the player guesses three consecutive songs correctly, they will win the game and the game will restart. If the player guesses incorrectly, their score will revert back to 0.

Limitations: Works only for 1 player

Needs a database to store scores
Only works for Twilio-verified numbers and the number that is put in the app
Ideal to host the server in a cloud service to make it more accessible
Backend: We are tracking how many times the player has guessed the song correctly and how many times the song has played in a text file so that the player doesn’t get duplicate songs played to them.



This project was made by Andrew Childs, Sarah Jang, Allyson Trinh, and Cindy Mei
