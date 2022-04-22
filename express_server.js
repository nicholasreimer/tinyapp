//EXPRESS SERVER:

//Express Server Setup:
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("./helpers");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["secretkey"],
  })
);

//-----------------------------------------------------------------------------------------
//OBJECT LIBRARY:

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
  },
};

//------------------------------------
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

//---------------------------------------------------------------------------------------------------
//GLOBALLY ACCESSIBLE FUNCTIONS:

function generateRandomString() {
  return Math.random().toString(20).substring(2, 6);
}
//-----------------------------------------------------

// -cycle through the key:values within the users object and find the corresponding user for a given email
function checkDuplicateEmail(email) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return true;
    }
  }
  return false;
}
//---------------------------------------------------

//returns the URLs where the userID is equal to the id of the currently logged-in user.
function urlsForUser(id) {
  const output = {};

  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL]["userID"] === id) {
      output[shortURL] = urlDatabase[shortURL];
    }
  }
  return output;
}

//---------------------------------------------------------------------------------------------------
//                             SERVER ROUTE REQUESTS: (below)                                      //
//---------------------------------------------------------------------------------------------------

// GET: /URLS/NEW
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: users[req.session["user_id"]],
  };

  if (users[req.session["user_id"]]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//----------------------------------------------------------------------------------------------------------
//POST: /URLS - gives clients a random string in place of ther inputed long url
app.post("/urls", (req, res) => {
  if (!users[req.session["user_id"]]) {
    return res.status(401).send("You aint supposed to be here");
  }
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;

  // in the case of a missing http input for longURL this code adds it to the clients input to make it whole.
  if (!longURL.includes("http")) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = { longURL, userID: req.session["user_id"] };
  res.redirect(`/urls/${shortURL}`); //redirect the client to the shortUrl page specific to there new shortURL
});

//--------------------------------------------------------------------------------------------------------------------
//GET: /U/:shortURL - redirects client to the newly generated shortURL for a clients inputed longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];

  if (!longURL) {
    return res.send("The given short-URL does not exsist");
  }
  res.redirect(longURL);
});

//-----------------------------------------------------------------------------------------------------------------------
//GET: /URLS - renders a page of all the urls stored currently in urlDatabase if certain conditions are met
app.get("/urls", (req, res) => {
  //if user is not logged in give them an error, do u exsist and do u hav an approprate cookie
  if (!users[req.session["user_id"]]) {
    return res
      .status(401)
      .send("You need to login or register to view this page");
  }

  let output = urlsForUser(req.session["user_id"]);

  const templateVars = {
    urls: output,
    username: users[req.session["user_id"]],
  };

  res.render("urls_index", templateVars);
});

//-----------------------------------------------------------------------------------------------------------------------
//POST: URLS DELETE - allows client to delete a shortURL and refreshes the page via a redirect to show the change
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!users[req.session["user_id"]]) {
    return res
      .status(401)
      .send("You need to login or register to view this page");
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//---------------------------------------------------------------------------------------------------
//POST: /URLS/:shortURL - allows clients to edit the value of an exsisiting longURL and refreshes the page via a redirect.
app.post("/urls/:shortURL", (req, res) => {
  if (!users[req.session["user_id"]]) {
    return res
      .status(401)
      .send("You need to login or register to view this page");
  }
  const shortURL = req.params.shortURL;
  let longURL = req.body.updatedURL;

  // in the case of a missing http input for longURL this code adds it to the clients input to make it whole.
  if (!longURL.includes("http")) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = { longURL, userID: req.session["user_id"] };
  res.redirect("/urls");
});

//----------------------------------------------------------------------------------------------------------------
//GET: /URLS/:shortURL - conditionals check if client has permission to visit a given shortURL
app.get("/urls/:shortURL", (req, res) => {
  if (!users[req.session["user_id"]]) {
    return res
      .status(401)
      .send("You need to login or register to view this page");
  }

  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("The url you gave does not exsist");
  }
  const longURL = urlDatabase[shortURL].longURL;

  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    username: users[req.session["user_id"]],
  };

  res.render("urls_show", templateVars);
});

//-------------------------------------------------------------------------------------------------------------
//GET: /REGISTER - directs clients to the appropriate register page
app.get("/register", (req, res) => {
  const templateVars = {
    username: users[req.session["user_id"]],
  };

  res.render("register", templateVars);
});

//-------------------------------------------------------------------------------------------------------------
//POST: /REGISTER - allows a user to submit info for registration to the application
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password);

  //Conditional to check if email OR password is equal to a falsey value
  if (!email || !password) {
    return res.status(400).send("Website requires an email and a password");
  }

  //Conditional to check whether the email has been taken or not?
  let result = checkDuplicateEmail(email);
  if (result) {
    return res
      .status(400)
      .send(
        "Email has already been taken! Please try again with another email."
      );
  }
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: hashedPassword,
  };

  // user is found in the users object give em a cookie
  req.session.user_id = id;
  res.redirect("/urls");
});

//--------------------------------------------------------------------------------------------------
//GET: /LOGIN - the endpoint for the login page
app.get("/login", (req, res) => {
  const templateVars = {
    username: users[req.session["user_id"]],
  };

  if (!users[req.session["user_id"]]) {
    res.render("login", templateVars);
  } else {
    res.redirect("/urls");
  }
});

//---------------------------------------------------------------------------------------------------
//POST: /LOGIN - related to client login and session cookie creation
app.post("/login", (req, res) => {
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;

  //Conditional to check if email OR password is equal to a falsey value
  if (!loginEmail || !loginPassword) {
    return res.status(403).send("Website requires an email and a password");
  }

  //Conditional to check whether the email and password (refered to as var user) is already present
  let user = getUserByEmail(loginEmail, users);
  if (!user) {
    return res
      .status(403)
      .send("Either the username or password was incorrect");
  }

  //Conditional checks password
  if (!bcrypt.compareSync(loginPassword, user.password)) {
    return res
      .status(403)
      .send("Either the username or password was incorrect");
  }

  //if you pass the above conditionals then u get a cookie and are redirected to the home page
  req.session.user_id = user.id;
  res.redirect("/urls");
});

//------------------------------------------------------------------------------------------------------------
//POST: /LOGOUT - route request that allows a client to logout and then redirects them to the register page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/register");
});

//------------------------------------------------------------------------------------------------------------
//CLIENT REQUEST LISTENER: (below)
//-------------------------------------------------------------------------------------------------------------
// -starts the server and begins to listen for client requests (routes) on this specified
//  port (see setup code at top)
// -the console.log generated by the callback is for verification in the terminal that the
//  server is now up and running on the specified port outlined in setup.

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//----------------------------------------------------------------------------------------
