// Import the dependency.
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options:any = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
};
let client: MongoClient;

client = new MongoClient(uri, options);
const collectionPromise = client.connect().then(_client => _client.db('hyper').collection('releases'))

export default collectionPromise;