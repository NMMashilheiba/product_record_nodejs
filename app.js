const http = require("http");
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 5000;

const uri =
  "mongodb+srv://mashil:Mashil123@nodeapi.a1u6ibd.mongodb.net/nodeapi?retryWrites=true&w=majority";
const client = new MongoClient(uri);

client.connect();

async function createRecord(client, newRecord) {
  const result = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .insertOne(newRecord);

  console.log(`New record created with id ${result.insertedId}`);
}

async function findTopFiveProduct(client) {
  var res = [];
  const pipeline = [
    {
      $group: {
        _id: "$name",
        quantity: {
          $sum: "$quantity",
        },
      },
    },
    {
      $sort: {
        quantity: -1,
      },
    },
    {
      $limit: 5,
    },
  ];

  const aggCursor = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .aggregate(pipeline);

  console.log("Top selling products are:");
  await aggCursor.forEach((topSellingProduct) => {
    // console.log(`${topSellingProduct._id}`);
    res.push(topSellingProduct._id);
    // console.log(res);
  });
  return res;
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/topproducts" && req.method === "GET") {
    // get the topSellingProducts.
    const todos = await findTopFiveProduct(client);
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    // send the data
    res.end(JSON.stringify(todos));
    console.log("Done");
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
