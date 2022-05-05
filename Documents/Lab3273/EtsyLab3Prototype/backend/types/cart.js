import graphql from 'graphql';
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;


const CartType = new GraphQLObjectType({
    name: 'CartItem',
    fields: () => ({
        _id: { type: GraphQLString },
      createdBy: { type: GraphQLString },
      productId: { type: GraphQLString },
      quantity: { type: GraphQLInt },
      isGift: { type: GraphQLBoolean },
      msg: { type: GraphQLString },
    })
  });
  



  export {CartType}