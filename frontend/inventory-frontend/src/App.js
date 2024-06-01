import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import StockManagement from './components/StockManagement';
import { Container, Box, Typography } from '@mui/material';
import { getProducts } from './services/api'; // Import the getProducts function

function App() {
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [stockDialogType, setStockDialogType] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      // Assuming you will use the fetched products later
      console.log(response.data); // This is just for demonstration; remove it later
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStock = (productId) => {
    setSelectedProductId(productId);
    setStockDialogType('add');
    setOpenStockDialog(true);
  };

  const handleRemoveStock = (productId) => {
    setSelectedProductId(productId);
    setStockDialogType('remove');
    setOpenStockDialog(true);
  };

  return (
    <Container>
      <Box sx={{ bgcolor: 'grey.200', p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="h2" gutterBottom>Product Inventory System</Typography>
        <ProductForm fetchProducts={fetchProducts} />
        <ProductList
          handleAddStock={handleAddStock}
          handleRemoveStock={handleRemoveStock}
          fetchProducts={fetchProducts}
        />
        <StockManagement
          open={openStockDialog}
          onClose={() => setOpenStockDialog(false)}
          productId={selectedProductId}
          type={stockDialogType}
          fetchProducts={fetchProducts}
        />
      </Box>
    </Container>
  );
}

export default App;
