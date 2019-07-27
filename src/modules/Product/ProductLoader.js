import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';

import ProductModel from './ProductModel';

export default class Product {
  constructor(data) {
    this.id = data.id;
    this._id = data._id;
    this.title = data.title;
    this.description = data.description;
    this.active = data.active;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(ProductModel, ids));

const viewerCanSee = (context, data) => true;

export const load = async (context, id) => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.ProductLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new Product(data) : null;
};

export const clearCache = ({ dataloaders }, id) => dataloaders.ProductLoader.clear(id.toString());

export const loadProducts = async (context, args) => {
  // const { user } = context;
  // if (!user) throw new Error('Unauthorized user');
  const { search } = args;
  const conditions = {
    ...(search != null
      ? { title: { $regex: new RegExp(args.search, 'ig') } }
      : {}),
  };

  const products = ProductModel.find(conditions).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: products,
    context,
    args,
    loader: load,
  });
};
