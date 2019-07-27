import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { connectionArgs } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/User/UserType';
import ProductType, { ProductConnection } from '../modules/Product/ProductType';
import { nodeField } from '../interface/Node';

import * as UserLoader from '../modules/User/UserLoader';
import * as ProductLoader from '../modules/Product/ProductLoader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      description: 'Me is the logged user',
      resolve: async (root, args, context) => UserLoader.load(context, context.user && context.user.id),
    },
    users: {
      type: GraphQLNonNull(UserConnection.connectionType),
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    product: {
      type: ProductType,
      description: 'Product by id',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (root, { id }, context) => ProductLoader.load(context, id),
    },
    products: {
      type: ProductConnection.connectionType,
      description: 'Search products by title',
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (obj, args, context) => ProductLoader.loadProducts(context, args),
    },
  }),
});
