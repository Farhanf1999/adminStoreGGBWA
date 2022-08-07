var http = require("http");
const waktu = require("./module");
var url = require("url");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    // res.write("Hello World x! " + waktu.myDateTime() + "\n");
    // res.write(req.url); //from client / -> res server (hasil)

    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    res.end(txt);
  })
  .listen(8080);

//node js http module
//28/02/2022
