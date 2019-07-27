import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../graphql/connection/customConnection';
import { registerType, nodeInterface } from '../../interface/Node';

const ProductType = registerType(
  new GraphQLObjectType({
    name: 'Product',
    description: 'Product type definition',
    fields: () => ({
      id: globalIdField('Product'),
      _id: {
        type: GraphQLNonNull(GraphQLString),
        resolve: product => product._id,
      },
      title: {
        type: GraphQLString,
        description: 'Title of the product',
      },
      description: {
        type: GraphQLString,
        description: 'Title of the product',
      },
      active: {
        type: GraphQLBoolean,
        description: 'Active of the product',
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export const ProductConnection = connectionDefinitions({
  name: 'Product',
  nodeType: ProductType,
});

export default ProductType;
