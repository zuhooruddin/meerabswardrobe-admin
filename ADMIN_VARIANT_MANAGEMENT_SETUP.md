# Admin Portal - Variant Management Setup

## Overview
This document describes the variant management features added to the admin portal (saorly adin) for managing clothing product variants (color, size, stock, pricing).

---

## New Features

### 1. Variant Management Component
**Location:** `src/pages-sections/admin/products/VariantManager.jsx`

**Features:**
- View all variants for a product in a table format
- Add new variants (color + size combinations)
- Edit existing variants
- Delete variants
- Visual color swatch display
- Stock quantity management
- Variant-specific pricing
- Status management (Active/Inactive/Deleted)

### 2. Product Form Integration
**Location:** `src/pages-sections/admin/products/ProductForm.jsx`

**Changes:**
- Added new tab: "Variants (Color & Size)"
- Integrated VariantManager component
- Passes product ID and SKU to variant manager

### 3. API Functions
**Location:** `src/utils/api/dashboard.js`

**New Functions:**
- `getProductVariantsAdmin(itemId, accessToken)` - Fetch variants for admin
- `addProductVariant(variantData, accessToken)` - Create new variant
- `updateProductVariant(variantId, variantData, accessToken)` - Update variant
- `deleteProductVariant(variantId, accessToken)` - Delete variant

---

## Backend API Endpoints

### 1. Get Product Variants (Admin)
```
GET /api/getProductVariantsAdmin?item_id=<product_id>
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  variants: [...]
}
```

### 2. Add Product Variant
```
POST /api/addProductVariant
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {
  item: <product_id>,
  color: "Blue",
  color_hex: "#0000FF",
  size: "M",
  sku: "TSH-M-BLU-M",
  stock_quantity: 10,
  variant_price: 650,  // optional
  status: 1
}
```

### 3. Update Product Variant
```
PATCH /api/updateProductVariant/<variant_id>
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {
  color: "Blue",
  stock_quantity: 15,
  variant_price: 700,
  status: 1
}
```

### 4. Delete Product Variant
```
DELETE /api/deleteProductVariant/<variant_id>
Headers: Authorization: Bearer <token>
```

---

## Usage Guide

### Adding Variants to a Product

1. **Navigate to Product Edit Page**
   - Go to Admin Portal → Products
   - Click on a product to edit

2. **Open Variants Tab**
   - Click on "Variants (Color & Size)" tab

3. **Add New Variant**
   - Click "Add Variant" button
   - Fill in the form:
     - **Color**: Enter color name (e.g., "Blue", "Red")
     - **Color Hex**: Select color using color picker
     - **Size**: Select from dropdown (XS, S, M, L, XL, XXL, XXXL)
     - **SKU**: Auto-generated or enter manually
     - **Stock Quantity**: Enter available stock
     - **Variant Price**: Optional - leave empty to use base price
     - **Status**: Active/Inactive/Deleted
   - Click "Add" to save

4. **Edit Variant**
   - Click the edit icon (pencil) next to a variant
   - Modify fields as needed
   - Click "Update" to save

5. **Delete Variant**
   - Click the delete icon (trash) next to a variant
   - Confirm deletion

---

## Variant Table Display

The variant table shows:
- **Color**: Color name with color swatch
- **Size**: Size (XS, S, M, L, XL, XXL, XXXL)
- **SKU**: Unique SKU for the variant
- **Stock**: Stock quantity with color-coded chip (green/red)
- **Price**: Variant price or "Use Base Price"
- **Status**: Active/Inactive with color-coded chip
- **Actions**: Edit and Delete buttons

---

## SKU Generation

The system auto-generates SKUs using the pattern:
```
{ProductSKU}-{ColorCode}-{Size}
```

Example:
- Product SKU: `TSH-M`
- Color: Blue → `BLU`
- Size: M
- Generated SKU: `TSH-M-BLU-M`

You can override the auto-generated SKU by editing it manually.

---

## Best Practices

1. **Color Naming**: Use consistent color names (e.g., "Navy Blue" vs "Navy")
2. **Color Hex Codes**: Always set hex codes for better visual representation
3. **Stock Management**: Keep stock quantities updated regularly
4. **Variant Pricing**: Only set variant_price if it differs from base price
5. **SKU Uniqueness**: Ensure each variant has a unique SKU
6. **Status Management**: Use "Inactive" to temporarily hide variants, "Deleted" for permanent removal

---

## Troubleshooting

### Variant Not Saving
- Check if color and size combination already exists
- Verify SKU is unique
- Ensure all required fields are filled

### Variants Not Loading
- Verify product ID is correct
- Check authentication token is valid
- Check browser console for errors

### Color Swatch Not Showing
- Ensure color_hex field has a valid hex code (e.g., "#FF0000")
- Check if color_hex field is not empty

---

## Technical Notes

- Variants are stored in the `product_variant` table
- Each variant must have a unique combination of `item`, `color`, and `size`
- Stock is managed at variant level, not product level
- Variant price overrides product base_price when set
- Status field controls variant visibility (1=Active, 2=Inactive, 3=Deleted)

---

## Future Enhancements

1. Bulk variant import/export
2. Variant image upload per color
3. Size guide integration
4. Variant analytics (best sellers, low stock alerts)
5. Duplicate variant functionality

