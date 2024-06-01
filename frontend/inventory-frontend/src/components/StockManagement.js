import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const StockManagement = ({ open, onClose, productId, type, handleStockChange }) => {
  const [subVariantId, setSubVariantId] = useState('');
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (!open) {
      setSubVariantId('');
      setStock(0);
    }
  }, [open]);

  const handleSubmit = () => {
    handleStockChange(productId, subVariantId, stock, type);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{type === 'add' ? 'Add Stock' : 'Remove Stock'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Sub Variant ID"
          fullWidth
          value={subVariantId}
          onChange={(e) => setSubVariantId(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Stock"
          fullWidth
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockManagement;
