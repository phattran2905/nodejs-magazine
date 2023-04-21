import {Schema, model} from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "inactive",
        enum: ["inactive", "active"]
    },
}, {timestamps: true})

const CategoryModel = model("Category", CategorySchema)

export default CategoryModel