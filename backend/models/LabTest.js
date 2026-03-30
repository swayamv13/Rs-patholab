import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        categorySlug: { type: String, required: true, trim: true },
        categoryLabel: { type: String, default: '' },
        kind: {
            type: String,
            enum: ['pathology', 'imaging', 'package'],
            default: 'pathology'
        },
        originalPrice: { type: Number, required: true, min: 0 },
        discountedPrice: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0 },
        details: { type: [String], default: [] },
        description: { type: String, default: '' },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const labTestModel = mongoose.models.labTest || mongoose.model('labTest', labTestSchema);
export default labTestModel;
