function getUserByEmail(loginEmail, database) {
  for (const userId in database) {
    const user = database[userId];

    if (user.email === loginEmail) {
      return user;
    }
  }
  return false;
}

module.exports = { getUserByEmail };
