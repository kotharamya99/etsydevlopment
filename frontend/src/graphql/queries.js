
import { gql } from 'apollo-boost';

const user = gql`
    query ($id: String){
        user(id: $id)
        {
            msg,
            username,
            imageUrl,
            dob,
            gender,
            address,
            city,
            state,
            country,
            about,
            email,
            phoneNo
        }
    }
`;

const checkshopnameavailable = gql`
    query ($shopname: String){
        checkshopnameavailable(shopname: $shopname)
        {
            msg,
            available
        }
    }
`;

const getShopByUserId = gql`
    query ($userId: String){
        getShopByUserId(userId: $userId)
        {
            msg,
            createdBy,
            createdOn,
            _id,
            name,
            imageUrl
        }
    }
`;

const getShopById = gql`
    query ($shopId: String){
        getShopById(shopId: $shopId)
        {
            msg,
            createdBy,
            createdOn,
            _id,
            name,
            imageUrl
        }
    }
`;


const getProductById = gql`
    query ($userId: String, $productId: String){
        getProductById(userId: $userId, productId: $productId)
        {
            msg,
            name,
            imageUrl,
            categoryId,
            description,
            price,
            quantity,
            shopId,
            createdBy,
            salesCount,
            shopName,
            _id
        }
    }
`;

const getOrders = gql`
    query ($userId: String){
        getOrders(userId: $userId)
        {
            productName,
            quantity,
            imageUrl,
            price,
            description,
            shopId,
            createdBy,
            createdOn,
            giftWrapDescription
        }
    }
`;

const getCart = gql`
    query ($cartId: String){
        getCart(cartId: $cartId)
        {
            _id,
            createdBy,
            productId,
            quantity,
            isGift,
            msg
        }
    }
`;




export {user, checkshopnameavailable, getCart, getOrders, getProductById, getShopById, getShopByUserId};