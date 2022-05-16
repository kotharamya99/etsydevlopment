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


const CheckShopNameAvailableType = new GraphQLObjectType({
    name: 'CheckShopName',
    fields: () => ({
      available: { type: GraphQLBoolean },
      msg: { type: GraphQLString }
    })
  });
  
  const CreateShopType = new GraphQLObjectType({
    name: 'CreateShop',
    fields: () => ({
      shopId: { type: GraphQLString },
      shopName: { type: GraphQLString },
      msg: { type: GraphQLString }
    })
  });
  
  const ShopDetailsType = new GraphQLObjectType({
    name: 'GetShopDetails',
    fields: () => ({
      imageUrl: { type: GraphQLString },
      name: { type: GraphQLString },
      _id: { type: GraphQLString },
      createdOn: { type: GraphQLString },
      createdBy: { type: GraphQLString },
      msg: { type: GraphQLString }
    })
  });


  export { ShopDetailsType, CreateShopType, CheckShopNameAvailableType}