const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });



// Add a book review
//used Sundararajan (staff) code
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let reviews = req.query.reviews;
        let reviewer = req.session.authorization['username'];
        //if the review has changed
        if(reviews) {
            filtered_book["reviews"][reviewer]= reviews;
            
        }
        books[isbn] = filtered_book;
        res.send(`Review for book with the isbn  ${isbn} updated.`);
    }
    else{
        res.send("Unable to find ISBN!");
    }
    });

// Delete a book review
//used Pallavi's code
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];
    
    if (filtered_review[reviewer]) {
        delete filtered_review[reviewer];
        res.send(`Review for book with the isbn  ${isbn} by user ${reviewer} deleted.`);
    }
    else{
        res.send("Cannot delete as the review has been posted by different user");
    }
    });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
