//Express Server:

//SETUP:
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//----------------------------------------------------
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
//------------------------------------------------------
// -Each of these app.get's represent a seperate get request function, with a call back as its
//  its second arg. Each app.get runs one at a time.
app.get("/", (req, res) => {
  res.send("Hello!");
});

//return the json value of object urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//returns an html formatted string to the clients browser
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//-------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
