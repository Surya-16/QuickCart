import { useState } from "react";
import { Typography } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Fragment } from "react";
import "./CreateProductForm.css";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../Redux/Customers/Product/Action";


const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
  
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    size: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
const dispatch=useDispatch();
const jwt=localStorage.getItem("jwt")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name==="size_quantity"?name="quantity":name=e.target.name;

    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      size: sizes,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!productData.imageUrl) errors.imageUrl = 'Image URL is required';
    else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(productData.imageUrl)) errors.imageUrl = 'Invalid image URL';
    if (!productData.brand) errors.brand = 'Brand is required';
    if (!productData.title) errors.title = 'Title is required';
    if (!productData.price) errors.price = 'Price is required';
    else if (isNaN(productData.price) || Number(productData.price) <= 0) errors.price = 'Price must be a positive number';
    if (!productData.discountedPrice) errors.discountedPrice = 'Discounted price is required';
    else if (isNaN(productData.discountedPrice) || Number(productData.discountedPrice) < 0) errors.discountedPrice = 'Discounted price must be a non-negative number';
    if (!productData.discountPersent) errors.discountPersent = 'Discount percent is required';
    else if (isNaN(productData.discountPersent) || Number(productData.discountPersent) < 0) errors.discountPersent = 'Discount percent must be a non-negative number';
    if (!productData.quantity) errors.quantity = 'Quantity is required';
    else if (isNaN(productData.quantity) || Number(productData.quantity) < 0) errors.quantity = 'Quantity must be a non-negative number';
    if (!productData.topLavelCategory) errors.topLavelCategory = 'Top level category is required';
    if (!productData.secondLavelCategory) errors.secondLavelCategory = 'Second level category is required';
    if (!productData.thirdLavelCategory) errors.thirdLavelCategory = 'Third level category is required';
    if (!productData.description) errors.description = 'Description is required';
    productData.size.forEach((size, idx) => {
      if (!size.name) errors[`sizeName${idx}`] = 'Size name is required';
      if (!size.quantity || isNaN(size.quantity) || Number(size.quantity) < 0) errors[`sizeQuantity${idx}`] = 'Size quantity must be a non-negative number';
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    dispatch(createProduct({data:productData,jwt}))
    console.log(productData);
  };


  return (
    <Fragment className="createProductContainer ">
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center "
      >
        Add New Product
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="createProductContainer min-h-screen"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={productData.imageUrl}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              error={!!errors.brand}
              helperText={errors.brand}
            />
          </Grid>
        
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              type="number"
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discounted Price"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              type="number"
              error={!!errors.discountedPrice}
              helperText={errors.discountedPrice}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPersent"
              value={productData.discountPersent}
              onChange={handleChange}
              type="number"
              error={!!errors.discountPersent}
              helperText={errors.discountPersent}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth error={!!errors.topLavelCategory}>
              <InputLabel>Top Level Category</InputLabel>
              <Select
                name="topLavelCategory"
                value={productData.topLavelCategory}
                onChange={handleChange}
                label="Top Level Category"
              >
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="kids">Kids</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth error={!!errors.secondLavelCategory}>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                name="secondLavelCategory"
                value={productData.secondLavelCategory}
                onChange={handleChange}
                label="Second Level Category"
              >
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
                <MenuItem value="brands">Brands</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth error={!!errors.thirdLavelCategory}>
              <InputLabel>Third Level Category</InputLabel>
              <Select
                name="thirdLavelCategory"
                value={productData.thirdLavelCategory}
                onChange={handleChange}
                label="Third Level Category"
              >
                <MenuItem value="top">Tops</MenuItem>
                <MenuItem value="women_dress">Dresses</MenuItem>
                <MenuItem value="t-shirts">T-Shirts</MenuItem>
                <MenuItem value="saree">Saree</MenuItem>
                <MenuItem value="lengha_choli">Lengha Choli</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Description"
              multiline
              name="description"
              rows={3}
              onChange={handleChange}
              value={productData.description}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          {productData.size.map((size, index) => (
            <Grid container item spacing={3} >
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size Name"
                  name="name"
                  value={size.name}
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                  error={!!errors[`sizeName${index}`]}
                  helperText={errors[`sizeName${index}`]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  name="size_quantity"
                  type="number"
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                  error={!!errors[`sizeQuantity${index}`]}
                  helperText={errors[`sizeQuantity${index}`]}
                />
              </Grid> </Grid>
            
          ))}
          <Grid item xs={12} >
            <Button
              variant="contained"
              sx={{ p: 0.7 }}
              color="primary"
              size="large"
              type="submit"
            >
              Add New Product
            </Button>
            
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default CreateProductForm;
