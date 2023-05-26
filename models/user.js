import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  id: {type: String}
})

export default mongoose.model('User', schema)
