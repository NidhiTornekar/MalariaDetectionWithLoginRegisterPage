This project contains a register and login page made using MERN Stack . 
Also OTP verification is available for both email(using nodemailer) and phone number(using twilio). 
The user is redirected to a predict page, where he can upload a cell image and a CNN Model predicts if it is Parasitized or Uninfected(with Malaria). 
The predictions, ground value and image are then stored in the mongodb database that can be accessed by the user when he wants to check his previous history.



A .env file is to be added in malarias folder which contains: 
MONGO_URI=give your mongodb atlas url

Also, add a .env file in server of the following format: 
DATABASE=give your mongodb atlas url 
EMAIL=give your email 
PASSWORD=go to your browser, type my account, enable 2 step verification, search for app passwords ,select app as mail and your device .It will generate a password 
TWILIO_ACCOUNT_SID=give your Twilio account SID 
TWILIO_AUTH_TOKEN=give your Twilio account Authentication Token 
TWILIO_PHONE_NUMBER=give your Twilio account Phone number

Also, node modules are to be added in client and server folders.

Change the path of the model in app.py

To run the project, 
In a terminal, type cd server-> node .\app.js 
Split the terminal and type cd malarias->python app.py 
Split the terminal and type cd client->cd src->npm start
