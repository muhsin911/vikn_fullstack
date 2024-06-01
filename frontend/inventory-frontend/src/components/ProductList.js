import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Grid, Card, CardContent, Typography, Button, Box, Container, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import StockManagement from './StockManagement';

const ProductList = ({ handleAddStock, handleRemoveStock }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productsPerPage] = useState(6);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data); // Assuming the response contains the products in a 'data' property
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleStockChange = (productId, subVariantId, stock, type) => {
    const updatedProducts = products.map(product => {
      if (product.ProductID === productId) {
        const updatedVariants = product.variants.map(variant => {
          const updatedSubVariants = variant.sub_variants.map(subVariant => {
            if (subVariant.id === subVariantId) {
              return {
                ...subVariant,
                stock: type === 'add' ? subVariant.stock + stock : subVariant.stock - stock
              };
            }
            return subVariant;
          });
          return {
            ...variant,
            sub_variants: updatedSubVariants
          };
        });
        return {
          ...product,
          variants: updatedVariants
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.ProductID !== productId);
    setProducts(updatedProducts);
  };

  const handleSaveEditProduct = () => {
    const updatedProducts = products.map(product => {
      if (product.ProductID === editProduct.ProductID) {
        return editProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
    setEditProduct(null);
  };

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Container maxWidth="lg">
      <Box sx={{ bgcolor: 'grey.300', p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="h4" gutterBottom>Product List</Typography>
        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.ProductID}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  {product.image && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <img src={product.image} alt={product.ProductName} style={{ maxHeight: 200, width: 'auto' }} />
                    </Box>
                  )}
                  <Typography variant="h5">{product.ProductName}</Typography>
                  <Typography variant="subtitle1">Code: {product.ProductCode}</Typography>
                  <Typography variant="subtitle1">ID: {product.ProductID}</Typography>
                  <Typography variant="subtitle1">Total Stock: {product.TotalStock}</Typography>
                  <Typography variant="subtitle1">HSN Code: {product.HSNCode}</Typography>
                  <Typography variant="subtitle1">Favourite: {product.IsFavourite ? "Yes" : "No"}</Typography>
                  <Typography variant="subtitle1">Active: {product.Active ? "Yes" : "No"}</Typography>
                  {product.variants.map((variant) => (
                    <Box key={variant.id} sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">{variant.name}</Typography>
                      {variant.sub_variants.map((subVariant) => (
                        <Box key={subVariant.id} sx={{ ml: 2 }}>
                          <Typography variant="body2">{subVariant.name} - Stock: {subVariant.stock}</Typography>
                        </Box>
                      ))}
                    </Box>
                  ))}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" variant="outlined" color="primary" onClick={() => {
                      setDialogType('add');
                      setSelectedProductId(product.ProductID);
                      setOpenStockDialog(true);
                    }}>Add Stock</Button>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => {
                      setDialogType('remove');
                      setSelectedProductId(product.ProductID);
                      setOpenStockDialog(true);
                    }}>Remove Stock</Button>
                    <Button size="small" variant="outlined" color="info" onClick={() => handleEditProduct(product)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteProduct(product.ProductID)}>Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(products.length / productsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>

      <StockManagement
        open={openStockDialog}
        onClose={() => setOpenStockDialog(false)}
        productId={selectedProductId}
        type={dialogType}
        handleStockChange={handleStockChange}
      />

      {editProduct && (
        <Dialog open={true} onClose={() => setEditProduct(null)}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Product Name"
              fullWidth
              value={editProduct.ProductName}
              onChange={(e) => setEditProduct({ ...editProduct, ProductName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Product Code"
              fullWidth
              value={editProduct.ProductCode}
              onChange={(e) => setEditProduct({ ...editProduct, ProductCode: e.target.value })}
            />
            <TextField
              margin="dense"
              label="HSN Code"
              fullWidth
              value={editProduct.HSNCode}
              onChange={(e) => setEditProduct({ ...editProduct, HSNCode: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Total Stock"
              fullWidth
              type="number"
              value={editProduct.TotalStock}
              onChange={(e) => setEditProduct({ ...editProduct, TotalStock: Number(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="Favourite"
              fullWidth
              value={editProduct.IsFavourite ? "Yes" : "No"}
              onChange={(e) => setEditProduct({ ...editProduct, IsFavourite: e.target.value === "Yes" })}
            />
            <TextField
              margin="dense"
              label="Active"
              fullWidth
              value={editProduct.Active ? "Yes" : "No"}
              onChange={(e) => setEditProduct({ ...editProduct, Active: e.target.value === "Yes" })}
            />
            <TextField
              margin="dense"
              label="Image URL"
              fullWidth
              value={editProduct.image || ''}
              onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProduct(null)} color="secondary">Cancel</Button>
            <Button onClick={handleSaveEditProduct} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ProductList;
