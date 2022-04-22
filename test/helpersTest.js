const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

const testUsers = {
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

//tests related to getUSerByEmail function
describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.equal(user.id, expectedUserID);
  });
  //Inside the same describe statement, add another it statement to test that a non-existent email returns undefined.
  it("a non exsistent email returns undefined", function () {
    const user = getUserByEmail("fake@example.com", testUsers);

    assert.equal(user, false);
  });
});
