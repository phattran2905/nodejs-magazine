import {Schema, model} from 'mongoose';
import { CATEGORY_STATUS, ICategory } from '../types/Category';

const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: CATEGORY_STATUS.active,
        enum: CATEGORY_STATUS
    },
}, {timestamps: true})

const CategoryModel = model<ICategory>("Category", CategorySchema)

export default CategoryModel