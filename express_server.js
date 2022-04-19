//Express Server:

//Express Server Setup:
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// MUST COME BEFORE ANY ROUTE REQUESTS
//middleware that makes it possible for our form related get/post requests to work
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//this code sets ejs as the template engine
app.set("view engine", "ejs");

//----------------------------------------------------
//this object stores our URL values
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//------------------------------------------------------
// -this GET route renders the urls_new.ejs template in the browser
//  so that a form presents to the client.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//a request at this path renders a page of all the urls stored currently in urlDatabase
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// -if a client makes a request at this specific path with there own value for (:shortURL)
//  that value will be stored in a var called shortURL and be used in the template vars object
//  so that it can rendered on our ejs file wherever it is called
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

//------------------------------------------------------
// CAN THE X3 app.gets below get DELETED?

// -if client goes to / path they will be greeted with a Hello string
app.get("/", (req, res) => {
  res.send("Hello!");
});

// -if a client goes to /urls.son they receive all the json info for the values stored in the
//  urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// -if a client creates a route to /hello path they will get a html formatted string in the
//  there browser
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//-------------------------------------------------------
// -starts the server and begins to listen for client requests (routes) on this specified
//  port (see setup code)
// -the console.log generated by the callback is for verification in the terminal that the
//  server is now up and running on the specified port outlined in setup

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
