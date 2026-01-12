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
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel, AddCircle } from "@mui/icons-material";
import { H4, H6 } from "components/Typography";

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
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Single variant form data
  const [formData, setFormData] = useState({
    color: "",
    color_hex: "#000000",
    size: "M",
    sku: "",
    stock_quantity: 0,
    variant_price: "",
    status: 1,
  });

  // Bulk add form data (multiple sizes for one color)
  const [bulkFormData, setBulkFormData] = useState({
    color: "",
    color_hex: "#000000",
    selectedSizes: [],
    defaultStock: 0,
    defaultPrice: "",
    status: 1,
  });

  const generateSku = (color, size) => {
    if (!productSku) return "";
    const colorCode = color.substring(0, 3).toUpperCase().replace(/\s/g, '');
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

  const handleOpenBulkDialog = () => {
    setBulkFormData({
      color: "",
      color_hex: "#000000",
      selectedSizes: [],
      defaultStock: 0,
      defaultPrice: "",
      status: 1,
    });
    setOpenBulkDialog(true);
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

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false);
    setBulkFormData({
      color: "",
      color_hex: "#000000",
      selectedSizes: [],
      defaultStock: 0,
      defaultPrice: "",
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

  const handleBulkInputChange = (field, value) => {
    setBulkFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (size) => {
    setBulkFormData((prev) => {
      const selectedSizes = prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size];
      return { ...prev, selectedSizes };
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
      variant_price: formData.variant_price ? parseFloat(formData.variant_price) : null,
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

  const handleBulkSave = () => {
    if (!bulkFormData.color) {
      alert("Please enter a color");
      return;
    }

    if (bulkFormData.selectedSizes.length === 0) {
      alert("Please select at least one size");
      return;
    }

    // Create variants for each selected size
    const newVariants = bulkFormData.selectedSizes.map((size) => {
      const sku = generateSku(bulkFormData.color, size);
      
      // Check if variant already exists
      const exists = variants.some(
        (v) => v.color === bulkFormData.color && v.size === size
      );

      if (exists) {
        return null; // Skip duplicates
      }

      return {
        color: bulkFormData.color,
        color_hex: bulkFormData.color_hex,
        size: size,
        sku: sku,
        stock_quantity: parseInt(bulkFormData.defaultStock) || 0,
        variant_price: bulkFormData.defaultPrice ? parseFloat(bulkFormData.defaultPrice) : null,
        status: parseInt(bulkFormData.status),
      };
    }).filter(Boolean); // Remove nulls (duplicates)

    if (newVariants.length === 0) {
      alert("All selected sizes already exist for this color");
      return;
    }

    // Add all new variants
    setVariants([...variants, ...newVariants]);
    
    const addedCount = newVariants.length;
    const skippedCount = bulkFormData.selectedSizes.length - addedCount;
    
    if (skippedCount > 0) {
      alert(`Added ${addedCount} variant(s). ${skippedCount} variant(s) already existed and were skipped.`);
    } else {
      alert(`Successfully added ${addedCount} variant(s) for ${bulkFormData.color}`);
    }

    handleCloseBulkDialog();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      const updatedVariants = variants.filter((_, idx) => idx !== index);
      setVariants(updatedVariants);
    }
  };

  // Group variants by color for better display
  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.color]) {
      acc[variant.color] = [];
    }
    acc[variant.color].push(variant);
    return acc;
  }, {});

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <H4>Product Variants (Color & Size)</H4>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddCircle />}
            onClick={handleOpenBulkDialog}
            sx={{ mr: 1 }}
          >
            Add Multiple Sizes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Single Variant
          </Button>
        </Box>
      </Box>

      {variants.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No variants added yet. Use "Add Multiple Sizes" to quickly add all sizes for a color, or "Add Single Variant" for individual variants.
        </Alert>
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

      {/* Bulk Add Dialog - Multiple Sizes for One Color */}
      <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AddCircle color="primary" />
            <Typography variant="h6">Add Multiple Sizes for One Color</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color Name"
                value={bulkFormData.color}
                onChange={(e) => handleBulkInputChange("color", e.target.value)}
                required
                placeholder="e.g., Red, Blue, Black"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color Hex Code"
                type="color"
                value={bulkFormData.color_hex}
                onChange={(e) => handleBulkInputChange("color_hex", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <H6 sx={{ mb: 1.5, fontWeight: 600 }}>Select Sizes (Multiple Selection)</H6>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 1,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                }}
              >
                {SIZE_CHOICES.map((sizeOption) => (
                  <FormControlLabel
                    key={sizeOption.value}
                    control={
                      <Checkbox
                        checked={bulkFormData.selectedSizes.includes(sizeOption.value)}
                        onChange={() => handleSizeToggle(sizeOption.value)}
                        color="primary"
                      />
                    }
                    label={sizeOption.label}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Stock Quantity"
                type="number"
                value={bulkFormData.defaultStock}
                onChange={(e) => handleBulkInputChange("defaultStock", e.target.value)}
                required
                inputProps={{ min: 0 }}
                helperText="Applied to all selected sizes"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Variant Price (Optional)"
                type="number"
                value={bulkFormData.defaultPrice}
                onChange={(e) => handleBulkInputChange("defaultPrice", e.target.value)}
                helperText="Leave empty to use product base price"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={bulkFormData.status}
                onChange={(e) => handleBulkInputChange("status", e.target.value)}
              >
                {STATUS_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {bulkFormData.selectedSizes.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>Preview:</strong> {bulkFormData.selectedSizes.length} size(s) will be added for color "{bulkFormData.color}":
                  <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                    {bulkFormData.selectedSizes.map((size) => (
                      <li key={size}>
                        {size} - SKU: {generateSku(bulkFormData.color, size)}
                      </li>
                    ))}
                  </Box>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkSave}
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={!bulkFormData.color || bulkFormData.selectedSizes.length === 0}
          >
            Add {bulkFormData.selectedSizes.length} Variant(s)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Variant Add/Edit Dialog */}
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
