import { GraphQLBoolean, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import ProductModel from '../ProductModel';

import * as ProductLoader from '../ProductLoader';
import ProductType from '../ProductType';

const mutation = mutationWithClientMutationId({
  name: 'ProductAdd',
  inputFields: {
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { active } = args;

    const newProduct = await new ProductModel({
      active,
    }).save();

    return {
      id: newProduct._id,
      error: null,
    };
  },
  outputFields: {
    product: {
      type: ProductType,
      resolve: async ({ id }, args, context) => {
        const newProduct = await ProductLoader.load(context, id);

        if (!newProduct) {
          return null;
        }

        return newProduct;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
