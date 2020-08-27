const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://douglasvallinhos:20mata20@igti.wxcpa.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(async (err) => {
  const collection = client.db('grades').collection('student');

  const documents = await collection.find().toArray();
  //console.log(documents);

  const databaseList = await client.db().admin().listDatabases();
  databaseList.databases.forEach((db) => {
    console.log(db.name);
  });
  client.close();
});
