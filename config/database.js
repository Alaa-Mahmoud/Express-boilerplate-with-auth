import mongoose from 'mongoose';
import MYENV from './app-env';

mongoose.Promise = global.Promise;

try {
    mongoose.connect(MYENV.MONGODB_URL);
} catch (error) {
    mongoose.createConnection(MYENV.MONGODB_URL);
}

mongoose.connection.once('open', () => {
    console.log('Connected successfully to MongoDB');
}).on('error', () => { throw error });