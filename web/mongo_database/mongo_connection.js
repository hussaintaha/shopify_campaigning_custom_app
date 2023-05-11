import mongoose from "mongoose"

export default function connect_mongo() {
    mongoose.connect(process.env.URL)
}


