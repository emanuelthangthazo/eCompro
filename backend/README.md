# BizzareFashion Backend API

A comprehensive Node.js/Express backend for the BizzareFashion e-commerce platform.

## Features

### 🔐 **Authentication**
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (user/seller/admin)

### 📦 **Product Management**
- CRUD operations for products
- Image upload support (max 5 images, 5MB each)
- Product search and filtering
- Category-based organization
- Stock management

### 📋 **Order Management**
- Order creation and tracking
- Status management (pending/processing/completed)
- Order history and analytics
- Customer information management

### 👥 **User Management**
- Profile management
- User role management
- Wishlist and order tracking

### 📊 **Analytics & Reporting**
- Sales analytics and reporting
- Top products tracking
- Revenue calculations
- Customer insights

### 🔒 **Security Features**
- Rate limiting (100 requests per 15 minutes)
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `POST /api/products` - Create new product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated, owner only)
- `DELETE /api/products/:id` - Delete product (authenticated, owner only)

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics (authenticated)

## Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (user/seller/admin),
  wishlist: [ObjectId],
  orders: [ObjectId],
  createdAt: Date
}
```

### Products Collection
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (clothing/accessories/footwear),
  stock: Number (required),
  images: [String],
  seller: ObjectId (ref: User),
  rating: Number,
  status: String (active/inactive/out-of-stock),
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  orderNumber: String (required, unique),
  customerName: String (required),
  customerEmail: String (required),
  products: [{product: ObjectId, quantity: Number, price: Number}],
  total: Number (required),
  status: String (pending/processing/completed/cancelled),
  seller: ObjectId (ref: User),
  shippingAddress: Object,
  paymentMethod: String,
  trackingNumber: String,
  createdAt: Date,
  deliveredAt: Date
}
```

## Installation

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up Environment:**
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and other environment variables

3. **Start Server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, Helmet.js, CORS
- **File Upload:** Multer
- **Validation:** express-validator
- **Rate Limiting:** express-rate-limit
- **Email:** Nodemailer (configured)

## Features Implementation

### Security
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 24-hour expiration
- Rate limiting to prevent abuse
- Input validation on all endpoints
- CORS configuration for frontend access
- Security headers with Helmet.js

### Performance
- Efficient database queries with pagination
- Image compression and optimization
- Caching strategies ready for implementation
- Database indexing on frequently queried fields

### Scalability
- Modular route structure
- Environment-based configuration
- Error handling middleware
- Logging system ready
- Graceful shutdown handling

## Development Notes

- Uses MongoDB for data persistence
- All routes are authenticated except register/login
- File uploads stored in `uploads/` directory
- Environment variables for sensitive data
- Comprehensive error handling throughout

This backend provides a solid foundation for the BizzareFashion e-commerce platform with room for future enhancements like payment processing, inventory management, and advanced analytics.
