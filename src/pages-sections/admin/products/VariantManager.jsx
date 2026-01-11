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
import { Add, Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { H4, H6 } from "components/Typography";
import api from "utils/api/dashboard";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

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
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = size;
    return `${productSku}-${colorCode}-${sizeCode}`;
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Variant
        </Button>
      </Box>

      {variants.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No variants added yet. Click "Add Variant" to create color and size combinations.
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
    </Box>
  );
};

export default VariantManager;

