import {Schema, model, models, InferSchemaType} from 'mongoose';
import { nanoid } from 'nanoid';
const HAWBschema = new Schema({
    hawb: { 
        type: String, 
        required: true,
        unique: true,  
    },
    owner: { 
        type: String, 
        required: true,
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["idle", "busy", "finish"], 
        default: "created",
    },
},{
    timestamps: true,
});
  
type hawb = InferSchemaType<typeof HAWBschema>;

const hawbModel = models.hawb || model('hawb', HAWBschema);
export default hawbModel