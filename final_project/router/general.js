const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const taskTenPromise = new Promise((resolve, reject)=>{
        resolve(res.send(JSON.stringify({books},null,4)));
    });
    taskTenPromise.then(()=> console.log("Task 10 promise resolved"));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const taskElevenPromise = new Promise((resolve, reject)=>{
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
    });
    taskElevenPromise.then(()=> console.log("Task 11 promise resolved"));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const taskTwelvePromise = new Promise((resolve, reject)=>{
        const author = req.params.author;
        let filtered_author = Object.values(books).filter((book) => book.author === author);
        resolve(res.send(filtered_author));
    });
    taskTwelvePromise.then(()=> console.log("Task 12 promise resolved"));
});


// Get all books based on title
public_users.get('/title/:title',(req,res)=>{
    const taskThirteenPromise = new Promise((resolve, reject)=>{
        const title = req.params.title;
        let filtered_title = Object.values(books).filter((book) => book.title === title);
        resolve(res.send(filtered_title));
    });
    taskThirteenPromise.then(()=> console.log("Task 13 promise resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
  
});

module.exports.general = public_users;
