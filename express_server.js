//EXPRESS SERVER:

//Express Server Setup: (inculdes middleware: cookieparser, bodyparser)
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//this code sets ejs as the template engine
app.set("view engine", "ejs");

//-----------------------------------------------------------------------------------------
//OBJECT LIBRARY:

//this object stores our URL values
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//----------------------------------------------------------------------------------------
//GLOBAL FUNCTION: implement a function that returns a string of 6 random alphanumeric characters:
function generateRandomString() {
  return Math.random().toString(20).substring(2, 6);
}
//code source: https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a

//----------------------------------------------------------------------------------------
//ROUTE REQUESTS:

// -GET route request renders the urls_new.ejs template in the browser
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: users[req.cookies["user_id"]],
  };
  res.render("urls_new", templateVars);
});

//post route request gives clients a random string in place of ther inputed long url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;

  // in the case of a missing http input for longURL this code adds it to the clients input to make it whole.
  if (!longURL.includes("http")) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`); //redirect the client to the shortUrl page specific to there new shortURL
});

// -if the client inputs ther newly generated shortURL they get redirected to the appropriate key value
// stored inside the urlDatabase
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  //*** GET /u/:id - https://web.compass.lighthouselabs.ca/projects/tiny-app (implement: conditional that says if(not long url)
  if (!longURL) {
    return res.send("The given short-URL does not exsist");
  }
  res.redirect(longURL);
});

//get route request that renders a page of all the urls stored currently in urlDatabase
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

// -post route request that let a client delete a given shortURL that was previously created and
//  refreshes the page via a redirect to show that it has been removed.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// -post route request that allows clients to change the value of an exsisiting longURL
//  by accesssing its shortURL key and refreshes the page via a redirect.
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.updatedURL;

  // in the case of a missing http input for longURL this code adds it to the clients input to make it whole.
  if (!longURL.includes("http")) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = longURL;
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
    username: users[req.cookies["user_id"]],
  };

  res.render("urls_show", templateVars);
});

//-------------------------------------------------------------------------------------------
//CREATE A USERNAME, AND LOGOUT IN THE WEBSITE HEADER:

// post route request makes it possible for users to create a username and connects a cookie to them
app.post("/login", (req, res) => {
  res.cookie("user_id", 1);
  res.redirect("/urls");
});

//post route request that allows a use to logout, redirects them to the register page
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/register");
});

//---------------------------------------------------------------------------------------------
//get route request that allows users to create a username and password
app.get("/register", (req, res) => {
  const templateVars = {
    username: users[req.cookies["user_id"]],
  };

  res.render("register", templateVars);
});

// the POST endpoint for register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();

  users[id] = {
    id,
    email,
    password,
  };

  res.cookie("user_id", id);
  res.redirect("/urls");
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
