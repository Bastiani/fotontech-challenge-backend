import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';

import { connectionDefinitions } from '../../graphql/connection/customConnection';
import { registerType, nodeInterface } from '../../interface/Node';

const ProductType = registerType(
  new GraphQLObjectType({
    name: 'Product',
    description: 'Product type definition',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the user',
      },
      active: {
        type: GraphQLBoolean,
        description: 'Active of the user',
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export const ProductConnection = connectionDefinitions({
  name: 'Product',
  nodeType: GraphQLNonNull(ProductType),
});

export default ProductType;
