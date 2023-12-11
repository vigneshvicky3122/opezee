const Mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const ObjectId = Mongodb.ObjectId;
const Client = new Mongodb.MongoClient(process.env.DB_URL);
const Db = Client.db(process.env.DB_NAME);
const Collection = Db.collection(process.env.DB_COLLECTION_NAME);

module.exports = { ObjectId, Client, Collection };
