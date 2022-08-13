async function createRecord(client, newListing) {
  const cursor = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .insertOne(newListing);

  console.log(`New listing created with id ${cursor.insertedId}`);
}

async function listAll(
  client,
  { maxNoOfResults = Number.MAX_SAFE_INTEGER } = {}
) {
  var res = [];
  const cursor = client
    .db("nodeapi")
    .collection("productSalesRecord")
    .find({})
    .limit(maxNoOfResults);

  const docs = await cursor.toArray();
  var results = docs;

  return results;
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

  const cursor = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .aggregate(pipeline);

  const docs = await cursor.toArray();
  var results = docs;

  return results;
}
async function todaysRevenue(client) {
  var res = 0;
  const pipeline = [
    {
      $group: {
        _id: "$dateTime",
        todayrev: {
          $sum: "$amount",
        },
      },
    },
  ];

  const cursor = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .aggregate(pipeline);

  const docs = await cursor.toArray();
  var results = docs;
  if (results.length > 0) {
    results.forEach((result, i) => {
      if (result._id == dateTime) {
        res += result.todayrev;
      }
    });
  }

  return res;
}

module.exports = { listAll, findTopFiveProduct, todaysRevenue, createRecord };
