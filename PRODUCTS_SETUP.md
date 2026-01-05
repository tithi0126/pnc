# 🛍️ Products Setup Guide

## Overview
Your PNC website now has a complete Products section with admin management and customer-facing display. Razorpay integration is commented out for now.

## 🚀 Quick Start

### 1. Add Sample Products (Optional)
Run this command on your server to add sample products:

```bash
cd backend
node scripts/seedProducts.js
```

### 2. Access Admin Panel
- Go to `/admin`
- Login with your admin credentials
- Click on "Products" tab
- Click "Add Product" to create new products

### 3. View Products on Website
- Go to `/products` to see the customer-facing products page
- Products are filtered by category
- Click images to view larger versions

## 📝 Product Fields

When creating products in the admin panel, you can set:

- **Name**: Product title
- **Description**: Detailed product description
- **Price**: Current selling price
- **Original Price**: Optional - shows discount if different
- **Category**: Nutrition Supplements, Health Foods, etc.
- **Stock Quantity**: Available inventory
- **Main Image**: Primary product image
- **Active Status**: Show/hide product
- **Available Status**: Enable/disable purchases

## 🎨 Features

### Customer View (`/products`)
- ✅ Category filtering
- ✅ Product grid layout
- ✅ Image gallery with modal
- ✅ Price display with discounts
- ✅ Stock status indicators
- ✅ Contact button (Razorpay commented out)

### Admin Management
- ✅ Full CRUD operations
- ✅ Bulk filtering and status toggles
- ✅ Image upload integration
- ✅ Category management
- ✅ Stock and availability controls

## 🔧 Razorpay Integration (Currently Disabled)

The payment functionality is commented out. To enable:

1. Uncomment Razorpay code in `src/pages/Products.tsx`
2. Uncomment imports in the same file
3. Add Razorpay environment variables to production
4. Install Razorpay package on backend

## 📊 Sample Products Included

The seeding script adds these products:
- Advanced Nutrition Consultation Package (₹4,999)
- Premium Whey Protein Isolate (₹2,499)
- Organic Superfood Blend (₹1,299)
- Sports Nutrition Bundle (₹3,499)
- Weight Management Program (₹6,999)
- Immunity Boost Kit (₹1,899)

## 🐛 Troubleshooting

### No Products Showing
- Check if backend is running
- Verify MongoDB connection
- Check browser console for errors

### Admin Can't Create Products
- Ensure user has admin role
- Check token validity
- Verify CORS settings

### Images Not Loading
- Check upload folder permissions
- Verify image URLs in database
- Check network connectivity

## 📞 Support

For issues:
1. Check browser developer console
2. Verify backend server logs
3. Test API endpoints directly
4. Ensure all environment variables are set
