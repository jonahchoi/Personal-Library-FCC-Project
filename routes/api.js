/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

//Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

module.exports = function (app) {
  
  const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    commentcount: Number,
    comments: [String]
  }, {versionKey: false});
  const Book = mongoose.model('Book', bookSchema);
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      //Search Book collection with no filter to find all books. Then add each to an array and return the array.  
      Book.find({}, (err, data)=>{

        let bookArray = [];
        data.forEach((book)=>{
          bookArray.push({
            title: book.title,
            _id: book._id,
            commentcount: book.commentcount
          });
        })
        return res.json(bookArray);
      });
      
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      //if no title is supplied, return error
      if(!title){
        return res.json('missing required field title');
      }
      
      //Create a new instance of the Book model, filling in all keys
      let book = new Book({
        title: title,
        commentcount: 0,
        comments: []
      });
      
      book.save((err, data)=>{
        if(err) return console.error(err);
        
        res.json({
          title: data.title,
          _id: data._id
        });
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err)=>{
        if(err) return console.log(err);
        res.json('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.find({_id: bookid}, (err, data)=>{
        if(err) return console.log(err);
        if(data.length === 0 ) return res.json('no book exists');
      
        res.json({
          title: data[0].title,
          _id: data[0]._id,
          comments: data[0].comments
        })
        
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment) return res.json('missing required field comment');

      Book.findOneAndUpdate(
        {_id: bookid}, 
        {$push: {comments: comment}, $inc: {commentcount:1} },
        {new: true},
        (err, data)=>{
          if(err)return console.log(err);
          if(!data) return res.json('no book exists');

          
          res.json({
            title: data.title,
            _id: data._id,
            comments: data.comments
          })
        }
      );
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findOneAndDelete({_id: bookid}, (err, data)=>{
        if(err) return console.log(err);
        if(!data) return res.json('no book exists');
        res.json('delete successful');
      })
    });
  
};
