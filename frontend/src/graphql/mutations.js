
import { gql } from 'apollo-boost';

const signUp = gql`
    mutation ($useranme: String, $password: String, $email: String){
        signUp(useranme: $useranme, password: $password, email: $email)
        {
            username,
            email
        }
    }
`;


const updateProfile = gql`
    mutation ($username: String, 
              $imageUrl: String, 
              $dob: String, 
              $gender: String, 
              $address: String, 
              $city: String,
              $state: String,
              $country: String,
              $about: String,
              $email: String,
              $phoneNo: String,
              $userId: String){
    updateProfile(username: $username, 
                  imageUrl: $imageUrl, 
                  dob: $dob,
                  gender: $gender,
                  address: $address,
                  city: $city,)
                  state: $state,
                  country: $country,
                  about: $about,
                  email: $email,
                  userId: $userId,
                  phoneNo: $phoneNo
        {
            userEdited,
            msg
        }
    }
`;


const createShop = gql`
    mutation ($name: String, $userId: String, $imageUrl: String){
        createShop(name: $name, userId: $userId, imageUrl: $imageUrl)
        {
            shopId,
            shopName,
            msg
        }
    }
`;

const updateShopById = gql`
    mutation ($shopId: String, $imageUrl: String){
        createShop(shopId: $shopId, imageUrl: $imageUrl)
        {
            imageUrl,
            name,
            _id,
            createdOn,
            createdBy,
            msg
        }
    }
`;

const createProduct = gql`
    mutation ($categoryId: String, 
              $imageUrl: String,
              $name: String,
              $description: String,
              $price: Int,
              $quantity: Int,
              $shopId: String,
              $userId: String){
        createProduct(categoryId: $categoryId, 
                      imageUrl: $imageUrl,
                      name: $name,
                      description: $description,
                      price: $price,
                      quantity: $quantity,
                      shopId: $shopId,
                      userId: $userId)
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


const updateProductById = gql`
    mutation ($productId: String, 
              $imageUrl: String,
              $name: String,
              $description: String,
              $price: Int,
              $quantity: Int){
    updateProductById(productId: $productId, 
                      imageUrl: $imageUrl,
                      name: $name,
                      description: $description,
                      price: $price,
                      quantity: $quantity)
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


const deleteCart = gql`
    mutation ($cartId: String){
        deleteCart(cartId: $cartId)
        {
            _id,
            createdBy,
            productId,
            quantity,
            isGift,
        }
    }
`;

const updateCart = gql`
    mutation ($cartId: String, $quantity: String){
        updateCart(cartId: $cartId, quantity: $quantity)
        {
            _id,
            createdBy,
            productId,
            quantity,
            isGift,
        }
    }
`;

const checkOutCart = gql`
    mutation ($userId: String){
        checkOutCart(userId: $userId)
        {
            msg
        }
    }
`;

export {signUp, updateProfile, createShop, createProduct, updateProductById, deleteCart, updateCart, checkOutCart};