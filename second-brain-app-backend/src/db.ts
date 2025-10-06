import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true}
})

const tagSchema = new Schema({
  title: {type: String, required: true, unique: true}
})

const contentTypes = ["youtube", "twitter"]
const contentSchema = new Schema({
  link: {type: String, unique: true},
  type: {type: String, enum: contentTypes, required: true},
  title: {type: String, unique: true, required: true},
  tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

const linkSchema = new Schema({
  hash: {type: String, unique: true},
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true}
})

export const UserModel = mongoose.model('User', userSchema)
export const TagModel = mongoose.model('Tag', tagSchema)
export const ContentModel = mongoose.model('Content', contentSchema)
export const LinkModel = mongoose.model('Link', linkSchema)