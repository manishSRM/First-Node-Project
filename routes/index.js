var url = require('url');
var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: '../public/images/' })

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node_db'
});

connection.connect();

function getQuery(req) {
    queries = url.parse(req.url, true);
    return queries.query.phone_no;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    phone_no = getQuery(req);
    command = 'SELECT * from USERS where phone_no = '+ phone_no;
    connection.query(command, function(err, rows, fields) {
        if (!err)
            res.send(rows);
        else {
            res.send("Something went wrong!!");
        }
    }, function() {
        connection.end();
    });
});

router.get('/getmessages/', function(req, res, next) {
    phone_no = getQuery();
    command = 'SELECT u.name, us.name, c.message from CHAT as c INNER JOIN USERS as u on u.phone_no = c.sender INNER JOIN USERS as us on us.phone_no = c.receiver WHERE c.sender = '+ phone_no;
    connection.query(command, function(err, rows, fields) {
        if (!err)
            res.send(rows);
        else {
            res.send("Something went wrong!!");
        }
    }, function() {
        connection.end();
    });
});

router.post("/", function(req, res, next) {
    console.log(req.body);
    res.send();
});

router.get('/upload/', function(req, res, next) {
    res.render("fileUpload");
});

router.post('/upload', upload.any(), function(req, res, next) {
    fileName = req.files[0]['originalname']
    phone_no = req.body.phone_no
    query = 'UPDATE USERS SET profile_pic = \''+ fileName + '\' where phone_no = '+ phone_no;
    console.log(query);
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            console.log(rows);
            res.send(rows);
        } else {
            res.send("Error in UPDATE query.");
        }
    });
});

module.exports = router;
