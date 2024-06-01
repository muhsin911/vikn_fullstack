import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { createProduct } from "../services/api"; // Import createProduct function from API service

const ProductForm = ({ fetchProducts }) => {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productId, setProductId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [createdUser, setCreatedUser] = useState("1"); // Default CreatedUser ID
  const [variants, setVariants] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [active, setActive] = useState(true);
  const [hsnCode, setHsnCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: "", options: "", subVariants: [{ name: "", stock: "" }] },
    ]);
  };

  const handleAddSubVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants[index].subVariants.push({ name: "", stock: "" });
    setVariants(updatedVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubVariantChange = (
    variantIndex,
    subVariantIndex,
    field,
    value
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subVariants[subVariantIndex][field] = value;
    setVariants(updatedVariants);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let productData;
  
    // Check if there's an image to upload
    if (imageFile) {
      productData = new FormData();
      productData.append("ProductName", productName);
      productData.append("ProductCode", productCode);
      productData.append("ProductID", productId);
      productData.append("ProductImage", imageFile);
      productData.append("CreatedUser", createdUser);
      productData.append("variants", JSON.stringify(variants));
      productData.append("IsFavourite", isFavourite);
      productData.append("Active", active);
      productData.append("HSNCode", hsnCode);
    } else {
      productData = {
        ProductName: productName,
        ProductCode: productCode,
        ProductID: productId,
        CreatedUser: createdUser,
        variants: variants,
        IsFavourite: isFavourite,
        Active: active,
        HSNCode: hsnCode,
      };
    }
  
    try {
      // Call createProduct function from API service to send product data to backend
      if (imageFile) {
        // Sending FormData for multipart/form-data
        await createProduct(productData);
      } else {
        // Sending JSON data
        await createProduct(JSON.stringify(productData));
      }
  
      // Fetch products after successful submission
      fetchProducts();
  
      // Reset form fields after successful submission
      setProductName("");
      setProductCode("");
      setProductId("");
      setImageFile(null);
      setVariants([]);
      setIsFavourite(false);
      setActive(true);
      setHsnCode("");
    } catch (error) {
      console.error("Error submitting product:", error);
  
      // Handle error
    }
  };
  

  return (
    <React.Fragment>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h5">Add New Product</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Created User"
              value={createdUser}
              onChange={(e) => setCreatedUser(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isFavourite}
                  onChange={(e) => setIsFavourite(e.target.checked)}
                  color="primary"
                />
              }
              label="Is Favourite"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="HSN Code"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="product-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="product-image">
              <Button variant="contained" color="primary" component="span">
                Upload Image
              </Button>
            </label>
          </Grid>
          <input type="hidden" name="CreatedUser" value="1" />
          {variants.map((variant, variantIndex) => (
            <React.Fragment key={variantIndex}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Variant Name"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Variant Options (comma separated)"
                  value={variant.options}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "options", e.target.value)
                  }
                />
              </Grid>
              {variant.subVariants.map((subVariant, subVariantIndex) => (
                <React.Fragment key={subVariantIndex}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sub-Variant Name"
                      value={subVariant.name}
                      onChange={(e) =>
                        handleSubVariantChange(
                          variantIndex,
                          subVariantIndex,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sub-Variant Stock"
                      value={subVariant.stock}
                      onChange={(e) =>
                        handleSubVariantChange(
                          variantIndex,
                          subVariantIndex,
                          "stock",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddSubVariant(variantIndex)}
                >
                  Add Sub-Variant
                </Button>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddVariant}
            >
              Add Variant
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        </Box>
      {/* Error dialog */}
      <Dialog open={!!errorMessage} onClose={handleCloseError}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ProductForm;

