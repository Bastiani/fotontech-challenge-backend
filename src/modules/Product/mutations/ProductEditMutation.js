import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import Product, * as ProductLoader from '../ProductLoader';
import ProductType from '../ProductType';
import ProductModel from '../ProductModel';

import { removeEmptyFields } from '../../../utils/removeEmptyFields';

const mutation = mutationWithClientMutationId({
  name: 'ProductEdit',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
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
  mutateAndGetPayload: async (args, context) => {
    // eslint-disable-next-line
    const { id, title, description, active } = args;

    const product = await ProductModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!product) {
      return {
        error: 'Product inválido',
      };
    }

    const payload = await removeEmptyFields({
      id,
      title,
      description,
      active,
    });

    // Edit record
    await product.update(payload);

    // Clear dataloader cache
    ProductLoader.clearCache(context, product._id);

    return {
      id: product._id,
      error: null,
    };
  },
  outputFields: {
    product: {
      type: ProductType,
      resolve: async ({ id }, args, context) => {
        const product = await ProductLoader.load(context, id);

        if (!product) {
          return null;
        }

        return product;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
