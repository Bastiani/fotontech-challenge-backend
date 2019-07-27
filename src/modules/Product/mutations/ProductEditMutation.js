import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import * as ProductLoader from '../ProductLoader';
import ProductType from '../ProductType';
import ProductModel from '../ProductModel';

import ProductFieldsType from '../ProductFieldsType';

const mutation = mutationWithClientMutationId({
  name: 'ProductEdit',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    ...ProductFieldsType,
  },
  mutateAndGetPayload: async (args, context) => {
    const { id, active } = args;

    const product = await ProductModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!product) {
      return {
        error: 'Product inválido',
      };
    }

    // Edit record
    await product.update({ active });

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
