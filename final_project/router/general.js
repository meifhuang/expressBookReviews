const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password})
      return res.status(200).json({message: "User successfully registered. Please login."})
    }
    else {
      return res.status(404).json({message: 'User exists'})
    }
  }
  return res.status(404).json({message: "Unable to register."});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books));
// });

public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books));
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Internal Server Error');
  }
});



 public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  try {
   const book = books[isbn]
   if (book) {
    res.send(JSON.stringify(book))
   }
  }
  catch (err) {
    console.error("Error fetching book by ISBN")
    res.status(500).send("Error")
  }
 });

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let author = req.params.author
  try { 
    for (let book in books) {
      if (books[book].author === author) {
        res.send(books[book])
        }
      }
    res.status(404).json({message: "Unable to find author"})
    }
    catch(err) {
      console.error("Err fetching by author")
      res.status(500).send("Error")
    }
  // return res.status(300).json({message: "Yet to be implemented"});
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title
  try { 
    for (let book in books) {
      if (books[book].title === title) {
        res.send(books[book])
      }
    }
      res.status(404).json({message: "Unable to find title"})
    }
catch (err) { 
  console.error("Err fetching by title")
  res.status(500).send("Error")
}

  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  res.send(books[isbn].reviews)
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
