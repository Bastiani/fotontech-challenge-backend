import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import ProductModel from '../ProductModel';

import Product from '../ProductLoader';
import { ProductConnection } from '../ProductType';

const mutation = mutationWithClientMutationId({
  name: 'ProductAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { title, description, active } = args;

    const newProduct = await new ProductModel({
      title,
      description,
      active,
    }).save();

    return {
      id: newProduct._id,
      product: newProduct,
      error: null,
    };
  },
  outputFields: {
    productEdge: {
      type: ProductConnection.edgeType,
      resolve: ({ product }) => {
        const node = new Product(product);
        return {
          cursor: toGlobalId('Product', product.id),
          node,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
