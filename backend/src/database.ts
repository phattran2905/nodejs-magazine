require('dotenv').config()
import { MongoClient } from 'mongodb'

const { MONGO_URI = 'mongodb://localhost/cooking_blog' } = process.env

export const client = new MongoClient(MONGO_URI)
export const database = client.db()
