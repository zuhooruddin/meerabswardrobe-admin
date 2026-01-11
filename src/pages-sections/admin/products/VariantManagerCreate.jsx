import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { H4 } from "components/Typography";

const SIZE_CHOICES = [
  { value: "XS", label: "Extra Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
  { value: "XXL", label: "Double Extra Large" },
  { value: "XXXL", label: "Triple Extra Large" },
];

const STATUS_CHOICES = [
  { value: 1, label: "Active" },
  { value: 2, label: "Inactive" },
];

const VariantManagerCreate = ({ variants, setVariants, productSku }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    color: "",
    color_hex: "#000000",
    size: "M",
    sku: "",
    stock_quantity: 0,
    variant_price: "",
    status: 1,
  });

  const generateSku = (color, size) => {
    if (!productSku) return "";
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = size;
    return `${productSku}-${colorCode}-${sizeCode}`;
  };

  const handleOpenDialog = (variant = null, index = null) => {
    if (variant && index !== null) {
      setEditingIndex(index);
      setFormData({
        color: variant.color || "",
        color_hex: variant.color_hex || "#000000",
        size: variant.size || "M",
        sku: variant.sku || "",
        stock_quantity: variant.stock_quantity || 0,
        variant_price: variant.variant_price || "",
        status: variant.status || 1,
      });
    } else {
      setEditingIndex(null);
      setFormData({
        color: "",
        color_hex: "#000000",
        size: "M",
        sku: "",
        stock_quantity: 0,
        variant_price: "",
        status: 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(null);
    setFormData({
      color: "",
      color_hex: "#000000",
      size: "M",
      sku: "",
      stock_quantity: 0,
      variant_price: "",
      status: 1,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate SKU when color or size changes
      if ((field === "color" || field === "size") && editingIndex === null) {
        updated.sku = generateSku(updated.color, updated.size);
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!formData.color || !formData.size) {
      alert("Please fill in color and size");
      return;
    }

    if (!formData.sku) {
      alert("Please enter SKU");
      return;
    }

    // Check for duplicate color+size combination
    const isDuplicate = variants.some((v, idx) => {
      if (editingIndex !== null && idx === editingIndex) return false;
      return v.color === formData.color && v.size === formData.size;
    });

    if (isDuplicate) {
      alert("A variant with this color and size already exists");
      return;
    }

    const variantData = {
      color: formData.color,
      color_hex: formData.color_hex,
      size: formData.size,
      sku: formData.sku,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      variant_price: formData.variant_price ? parseInt(formData.variant_price) : null,
      status: parseInt(formData.status),
    };

    if (editingIndex !== null) {
      // Update existing variant
      const updatedVariants = [...variants];
      updatedVariants[editingIndex] = variantData;
      setVariants(updatedVariants);
    } else {
      // Add new variant
      setVariants([...variants, variantData]);
    }

    handleCloseDialog();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      const updatedVariants = variants.filter((_, idx) => idx !== index);
      setVariants(updatedVariants);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <H4>Product Variants (Color & Size)</H4>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Variant
        </Button>
      </Box>

      {variants.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No variants added yet. Click "Add Variant" to create color and size combinations.
        </Typography>
      )}

      {variants.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Color</strong></TableCell>
                <TableCell><strong>Size</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {variant.color_hex && (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: variant.color_hex,
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                      {variant.color}
                    </Box>
                  </TableCell>
                  <TableCell>{variant.size}</TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>
                    <Chip
                      label={variant.stock_quantity}
                      color={variant.stock_quantity > 0 ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {variant.variant_price
                      ? `₹${variant.variant_price}`
                      : "Use Base Price"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        STATUS_CHOICES.find((s) => s.value === variant.status)?.label ||
                        "Unknown"
                      }
                      color={variant.status === 1 ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(variant, index)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingIndex !== null ? "Edit Variant" : "Add New Variant"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color Hex Code"
                type="color"
                value={formData.color_hex}
                onChange={(e) => handleInputChange("color_hex", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                required
              >
                {SIZE_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                required
                helperText="Unique SKU for this variant"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) =>
                  handleInputChange("stock_quantity", e.target.value)
                }
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Variant Price (Optional)"
                type="number"
                value={formData.variant_price}
                onChange={(e) =>
                  handleInputChange("variant_price", e.target.value)
                }
                helperText="Leave empty to use product base price"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {STATUS_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            {editingIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VariantManagerCreate;

