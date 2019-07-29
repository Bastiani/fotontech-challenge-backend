import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      hidden: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Whether the user is admin or not',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'User',
  },
);

UserSchema.index({ name: 'text' });
UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', function hashPassword(next) {
  // Hash the password
  if (this.isModified('password')) {
    return this.encryptPassword(this.password)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(err => next(err));
  }
  return next();
});

UserSchema.methods = {
  async authenticate(plainText) {
    try {
      return await bcrypt.compare(plainText, this.password);
    } catch (err) {
      return false;
    }
  },
  async encryptPassword(password) {
    return bcrypt.hash(password, 8);
  },
};

export default models.User || model('User', UserSchema);
