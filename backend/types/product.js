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


const CreateProductType = new GraphQLObjectType({
    name: 'CreateProduct',
    fields: () => ({
      msg: { type: GraphQLString },
      name: { type: GraphQLString },
      imageUrl: { type: GraphQLString },
      categoryId: { type: GraphQLString },
      description: { type: GraphQLString },
      price: { type: GraphQLInt },
      quantity: { type: GraphQLInt },
      shopId: { type: GraphQLString },
      createdBy: { type: GraphQLString },
      salesCount: { type: GraphQLInt },
      shopName: { type: GraphQLString },
      _id: { type: GraphQLString },
    })
  });
  



  export {CreateProductType}