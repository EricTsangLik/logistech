import {Schema, model, models, InferSchemaType} from 'mongoose';
import { nanoid } from 'nanoid';
const userSchema = new Schema({
  username: { 
    type: String, 
    required: true,
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  groups: {
    type: Array<String>,
    required: true,
  },
},{
  timestamps: true,
});
  
type user = InferSchemaType<typeof userSchema>;

const userModel = models.user || model('user', userSchema);

export default userModel;