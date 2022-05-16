import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axios";
const EditForm = ({
  categories,
  editItemProduct,
  pullEditItemData,
  submitError,
}) => {
  const [editProductDetails, setEditProductDetails] = useState(editItemProduct)
  // useEffect(() => {
  //   setEditProductDetails(editItemProduct)
  //   console.log("editItemProduct", editItemProduct)
  //   console.log("editItemData", editItemData)
  //   console.log("editProductDetails", editProductDetails)
  // }, [editItemProduct])

  const handleEditItemInputChange = (e) => {
    setEditProductDetails({
      ...editProductDetails,
      [e.target.name]: e.target.value,
    })
    console.log(editProductDetails)
    pullEditItemData(editProductDetails)
  }

  const handleEditItemUpload = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("myImage", e.target.files[0])
    console.log(e.target.files[0])
    console.log(formData)
    axiosInstance({
      method: "post",
      //url: "https://sharansantosh-etsyprototype.herokuapp.com/upload",
      url: "http://localhost:3001",
      data: formData,
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
      .then((response) => {
        console.log("response from upload", response.data)
        setEditProductDetails({
          ...editProductDetails,
          imageUrl: response.data.imageUrl,
        })
      })
      .catch((error) => {
        console.log("error while uploading", error)
        setEditProductDetails({
          ...editProductDetails,
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0550/2595/9111/products/placeholder-images-image_large_fdf08b50-ae9b-476d-bce2-aa57319b6b67_600x.png?v=1634637556",
        })
      })
  }

  return (
    <div>
      <form>
        {submitError && (
          <div class='alert alert-danger' role='alert'>
            {submitError}
          </div>
        )}
        <div class='form-group'>
          <label for='name' class='col-form-label'>
            Product Name
          </label>
          <input
            type='text'
            class='form-control'
            id='name'
            name='name'
            value={editProductDetails.name}
            onChange={handleEditItemInputChange}
          />
        </div>
        <div class='form-group'>
          <label for='category'>Category</label>
          <select
            id='category'
            class='form-control'
            name='categoryId'
            value={editProductDetails.categoryId}
            onChange={handleEditItemInputChange}
          >
            <option disabled selected>
              Choose Category
            </option>
            {categories &&
              categories.map((category) => {
                return <option value={category._id}>{category.name}</option>
              })}
          </select>
        </div>
        <div class='form-group'>
          <label class='col-form-label' for='price'>
            Price (USD)
          </label>
          <input
            type='number'
            class='form-control'
            id='price'
            name='price'
            value={editProductDetails.price}
            onChange={handleEditItemInputChange}
          />
        </div>
        <div class='form-group'>
          <label for='message-text' class='col-form-label'>
            Description
          </label>
          <textarea
            class='form-control'
            name='description'
            value={editProductDetails.description}
            onChange={handleEditItemInputChange}
          ></textarea>
        </div>
        <div class='form-group'>
          <label for='recipient-name' class='col-form-label'>
            Quantity Available
          </label>
          <input
            type='number'
            name='quantity'
            value={editProductDetails.quantity}
            onChange={handleEditItemInputChange}
            class='form-control'
          />
        </div>
        <div className='form-group'>
          <label class='form-label' for='customFile'>
            Upload Product Image
          </label>
          <input
            type='file'
            class='form-control'
            accept='image/*'
            id='customFile'
            name='imageUrl'
            // value={editProductDetails.imageUrl}
            onChange={handleEditItemUpload}
          />
        </div>
      </form>
    </div>
  )
}

export default EditForm
