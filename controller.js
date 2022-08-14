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
async function todaysRevenue(client, dateTime) {
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

// async function todaysSells(client, dateTime) {
//   const pipeline = [
//     {
//       $group: {
//         _id: "$dateTime",
//         list: {
//           $addToSet: "$name",
//         },
//       },
//     },
//   ];

//   const cursor = await client
//     .db("nodeapi")
//     .collection("productSalesRecord")
//     .aggregate(pipeline);

//   const docs = await cursor.toArray();
//   var results = docs;
//   var result = [];

//   console.log(typeof results, "Results");
//   results.forEach((res) => {
//     if (res._id === dateTime) {
//       result.push(res);
//       //   console.log(res.list);
//     }
//   });
//   // console.log(res._id);
//   // console.log(dateTime, "req");

//   return result;
// }

async function todaysSells(client, dateTime) {
  const cursor = await client
    .db("nodeapi")
    .collection("productSalesRecord")
    .find({ dateTime: dateTime });

  const docs = await cursor.toArray();
  var results = docs;

  console.log(results, "Results");

  return results;
}

module.exports = {
  listAll,
  findTopFiveProduct,
  todaysRevenue,
  createRecord,
  todaysSells,
};
