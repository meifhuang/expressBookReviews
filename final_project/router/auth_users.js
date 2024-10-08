const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  if (userswithsamename.length > 0) {
    return true
  }
  else {
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  })

  if (validUsers.length > 0) {
    return true
  }
  else {
    return false
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({message: "Missing username or password"})
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60})
  req.session.authorization = {
    accessToken, username }
  return res.status(200).send("user successfully logged in")
  }
  else {
    return res.status(208).json({message: "Invalid login. Check user and pass"})
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
 
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  const review = req.params.review
 
  let bookToUpdate = books[isbn]
  if (bookToUpdate) {
    if (review) {
      bookToUpdate["reviews"][username] = review
    }
    res.send(`The review for book with ISBN ${isbn} has been added.`)
  }
  else {
    res.status(404).json({message: 'Unable to find book'})
  }
}
)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  let reviewsToDelete = books[isbn].reviews

  if (reviewsToDelete) {
    delete reviewsToDelete[username]
    res.send(`Reviews for ISBN ${isbn} posted by ${username} deleted`)
  }
  else {
    res.status(404).json({message: "Unable to find book"})
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
