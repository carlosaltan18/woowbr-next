import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: false }
}, { versionKey: false }) 

export default mongoose.models.User || mongoose.model('User', UserSchema)
