import { GraphQLObjectType } from 'graphql';

import UserAddMutation from '../modules/User/mutations/UserAddMutation';
import UserLoginMutation from '../modules/User/mutations/UserLoginMutation';
import ProductAddMutation from '../modules/Product/mutations/ProductAddMutation';
import ProductEditMutation from '../modules/Product/mutations/ProductEditMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // auth
    UserLoginMutation,
    UserAddMutation,
    ProductAddMutation,
    ProductEditMutation,
  }),
});
