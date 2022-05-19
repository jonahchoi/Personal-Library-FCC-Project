/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testId;
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Harry Potter'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Response object should contain title');
            assert.property(res.body, '_id', 'Response object should contain _id');
            testId = res.body._id;
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'missing required field title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/000000000000000000000000')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+testId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+testId)
          .send({comment: 'A nice comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.isString(res.body.comments[0], 'The comments array should have the comment added as a string');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();

          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/'+testId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be a string');
            assert.equal(res.body, 'missing required field comment');
            done();

          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/000000000000000000000000')
          .send({comment: 'A nice comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be a string');
            assert.equal(res.body, 'no book exists');
            done();

          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/'+testId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be a string');
            assert.equal(res.body, 'delete successful');
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/000000000000000000000000')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be a string');
            assert.equal(res.body, 'no book exists');
            done();
          })
      });

    });

  });

});
