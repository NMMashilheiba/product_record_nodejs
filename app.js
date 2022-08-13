const http = require("http");
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 5000;
const {
  findTopFiveProduct,
  listAll,
  todaysRevenue,
  createRecord,
} = require("./controller");
const { getReqData } = require("./utils");

const uri =
  "mongodb+srv://mashil:Mashil123@nodeapi.a1u6ibd.mongodb.net/nodeapi?retryWrites=true&w=majority";
const client = new MongoClient(uri);
try {
  client.connect();
} catch (error) {
  console.log(error);
}

var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
// var time =
//   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date;

// API routes
const server = http.createServer(async (req, res) => {
  // route #1 GET TOP FIVE SELLING RECORDS
  if (req.url === "/product/topproducts" && req.method === "GET") {
    const todos = await findTopFiveProduct(client);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  }
  // route #2 GET ALL RECORDS
  else if (req.url === "/product/allproducts" && req.method === "GET") {
    const todos = await listAll(client);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  }

  // route #3 CREATE RECORD
  else if (req.url === "/product/create/record" && req.method === "POST") {
    let userData = await getReqData(req);
    let data = JSON.parse(userData);
    // console.log(JSON.parse(userData));
    const result = await createRecord(client, data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  }
  // route #4
  else if (req.url === "/product/todaysrevenue" && req.method === "GET") {
    const todos = await todaysRevenue(client, { maxNoOfResults: 5 });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  }

  // No route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "404 route not found :( " }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
