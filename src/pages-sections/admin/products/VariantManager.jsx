import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
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
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel, AddCircle } from "@mui/icons-material";
import { H4, H6 } from "components/Typography";
import api from "utils/api/dashboard";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Checkbox, FormControlLabel, Divider } from "@mui/material";

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
  { value: 3, label: "Deleted" },
];

const VariantManager = ({ productId, productSku }) => {
  const { data: session } = useSession();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
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

  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  const fetchVariants = async () => {
    if (!session?.accessToken) return;
    
    setLoading(true);
    try {
      // Use admin endpoint for variant management
      const response = await api.getProductVariantsAdmin(productId, session.accessToken);
      if (response.success) {
        setVariants(response.variants || []);
      } else {
        toast.error(response.error || "Failed to fetch variants");
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
      toast.error("Error loading variants");
    } finally {
      setLoading(false);
    }
  };

  const generateSku = (color, size) => {
    if (!productSku) return "";
    const colorCode = color.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const sizeCode = size;
    return `${productSku}-${colorCode}-${sizeCode}`;
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

  const handleBulkSave = async () => {
    if (!session?.accessToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!bulkFormData.color) {
      toast.error("Please enter a color");
      return;
    }

    if (bulkFormData.selectedSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    try {
      // Create variants for each selected size
      const promises = bulkFormData.selectedSizes.map(async (size) => {
        const sku = generateSku(bulkFormData.color, size);
        
        // Check if variant already exists
        const exists = variants.some(
          (v) => v.color === bulkFormData.color && v.size === size
        );

        if (exists) {
          return { success: false, message: `Variant ${bulkFormData.color} - ${size} already exists` };
        }

        const variantPayload = {
          item: productId,
          color: bulkFormData.color,
          color_hex: bulkFormData.color_hex,
          size: size,
          sku: sku,
          stock_quantity: parseInt(bulkFormData.defaultStock) || 0,
          variant_price: bulkFormData.defaultPrice ? parseFloat(bulkFormData.defaultPrice) : null,
          status: parseInt(bulkFormData.status),
        };

        const response = await api.addProductVariant(
          variantPayload,
          session.accessToken
        );
        return response;
      });

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} variant(s) for ${bulkFormData.color}`);
        fetchVariants();
        handleCloseBulkDialog();
      }
      
      if (failCount > 0) {
        toast.warning(`${failCount} variant(s) could not be added (may already exist)`);
      }
    } catch (error) {
      console.error("Error saving bulk variants:", error);
      toast.error("Error saving variants");
    }
  };

  const handleOpenDialog = (variant = null) => {
    if (variant) {
      setEditingVariant(variant);
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
      setEditingVariant(null);
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
    setEditingVariant(null);
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
      if ((field === "color" || field === "size") && !editingVariant) {
        updated.sku = generateSku(updated.color, updated.size);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!session?.accessToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!formData.color || !formData.size) {
      toast.error("Please fill in color and size");
      return;
    }

    if (!formData.sku) {
      toast.error("Please enter SKU");
      return;
    }

    try {
      const variantPayload = {
        item: productId,
        color: formData.color,
        color_hex: formData.color_hex,
        size: formData.size,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        variant_price: formData.variant_price ? parseInt(formData.variant_price) : null,
        status: parseInt(formData.status),
      };

      if (editingVariant) {
        // Update existing variant
        const response = await api.updateProductVariant(
          editingVariant.id,
          variantPayload,
          session.accessToken
        );
        if (response.success) {
          toast.success("Variant updated successfully");
          fetchVariants();
          handleCloseDialog();
        } else {
          toast.error(response.error || "Failed to update variant");
        }
      } else {
        // Create new variant
        const response = await api.addProductVariant(
          variantPayload,
          session.accessToken
        );
        if (response.success) {
          toast.success("Variant added successfully");
          fetchVariants();
          handleCloseDialog();
        } else {
          toast.error(response.error || "Failed to add variant");
        }
      }
    } catch (error) {
      console.error("Error saving variant:", error);
      toast.error("Error saving variant");
    }
  };

  const handleDelete = async (variantId) => {
    if (!session?.accessToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      const response = await api.deleteProductVariant(variantId, session.accessToken);
      if (response.success) {
        toast.success("Variant deleted successfully");
        fetchVariants();
      } else {
        toast.error(response.error || "Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Error deleting variant");
    }
  };

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

      {variants.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No variants added yet. Use "Add Multiple Sizes" to quickly add all sizes for a color, or "Add Single Variant" for individual variants.
        </Alert>
      )}

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
            {variants.map((variant) => (
              <TableRow key={variant.id}>
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
                    : variant.actual_price
                    ? `₹${variant.actual_price}`
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
                    onClick={() => handleOpenDialog(variant)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(variant.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVariant ? "Edit Variant" : "Add New Variant"}
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
            {editingVariant ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default VariantManager;

