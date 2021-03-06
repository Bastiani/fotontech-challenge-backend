import DataLoader from 'dataloader';

import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';

import UserModel from './UserModel';

export default class User {
  constructor(data) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.active = data.active;
    this.isAdmin = data.isAdmin;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(UserModel, ids));

const viewerCanSee = (context, data) => true;

export const load = async (context, id): Promise<?User> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.UserLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new User(data) : null;
};

export const clearCache = ({ dataloaders }, id) => dataloaders.UserLoader.clear(id.toString());

export const loadUsers = async (context, args) => {
  const { user } = context;
  if (!user) throw new Error('Unauthorized user');
  const { search } = args;
  const conditions = {
    ...(search != null
      ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
      : {}),
  };

  const users = UserModel.find(conditions).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};
