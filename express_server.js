//EXPRESS SERVER:

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

//-----------------------------------------------------------------------------------------
//this object stores our URL values
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//----------------------------------------------------------------------------------------
//GLOBAL FUNCTION: implement a function that returns a string of 6 random alphanumeric characters:
function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
}
//code source: https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a

//----------------------------------------------------------------------------------------
//ROUTE REQUESTS:

// -this GET route renders the urls_new.ejs template in the browser
//  so that a form presents to the client.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//related to forms
app.post("/urls", (req, res) => {
  // -assign a random string to a var called shortURL and add shortURL as a new key inside
  //  urlDatabase object with the user input for longurl as its key value.
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log("current urlDatabase: ", urlDatabase);

  res.redirect(`/urls/${shortURL}`); //redirect the client to the shortUrl page specific to there new shortURL
});

// -if the client inputs ther newly generated shortURL they get redirected to the appropriate key value
// stored inside the urlDatabase
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//a request at this path renders a page of all the urls stored currently in urlDatabase
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// -a route request that deletes a given shortURL that was previously created and
//  refreshes the page via a redirect to show that it has been removed.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
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

//----------------------------------------------------------------------------------------
//CLIENT REQUEST LISTENER:

// -starts the server and begins to listen for client requests (routes) on this specified
//  port (see setup code)
// -the console.log generated by the callback is for verification in the terminal that the
//  server is now up and running on the specified port outlined in setup

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//----------------------------------------------------------------------------------------
