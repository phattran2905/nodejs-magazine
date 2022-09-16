import mongoose from 'mongoose'

function connectDb() {
  mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost/cooking_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  mongoose.connection.once('open', () => console.log('Successfully connected to MongoDb'))

  mongoose.connection.once('error', () => console.error.bind(console, 'connection error'))
}

export default connectDb
