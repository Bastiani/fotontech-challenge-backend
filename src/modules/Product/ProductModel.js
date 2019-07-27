import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Product',
  },
);

export default mongoose.model('Product', Schema);
