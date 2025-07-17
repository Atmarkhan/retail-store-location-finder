# Project Summary: Finding suitable plots for opening a retail store branch.

## 🏗️ What's the problem I want to solve:

A retail store chain wants to expand into a new neighborhood. To make the number of clients as large as possible, the new branch should be at a distance of no more than k from all the houses in the neighborhood. A is a matrix of size N x M. It represents the neighborhood as a rectangular grid, in which each cell is an integer 0 (an empty plot) or 1 (a house). The distance between two cells is calculated as minimum number of cell borders that one has to cross to move from the source cell to the target cell. It does not matter whether the cells on the way are empty or occupied but it does not allow for moving through corners. A store can be only built on an empty plot. How many suitable locations are there?

For example, given K=2 and matrix A= [[0,0,0,0], [0,0,1,0],[1,0,0,1]], houses are located in cells with coordinates(2,3), (3,1) and (3,4). We can build a new store on two empty plots that are close enough to all houses. The first possible empty plot is located at (3,2). the distance to first house at(2,3) is 2. The distance to second house at (3,1) is 1. The third house at (3,4) is at distance of 2. The second possible empty plot is located(3,3). the distance to the first second and third houses are 1,2 and 1 respectively.

I've created a complete TypeScript application with Node.js API for solving the Manhattan distance store location problem. Here's what's included:

### 📁 Method choosen: Manhattan distance calculation method

### 📁 Project Structure

```
manhattan-distance-challenge/
├── src/
│   ├── types.ts           # TypeScript interfaces and types
│   ├── utils.ts           # Utility functions and validation
│   ├── solver.ts          # Core algorithm implementation
│   ├── app.ts             # Express.js API server
│   ├── index.ts           # Main entry point
│   ├── test-setup.ts      # Jest test configuration
│   ├── utils.test.ts      # Unit tests for utilities
│   ├── solver.test.ts     # Unit tests for solver
│   └── app.test.ts        # API integration tests
├── dist/                  # Compiled JavaScript output
├── coverage/              # Test coverage reports
├── .vscode/
│   └── tasks.json         # VS Code tasks configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest testing configuration
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Git ignore rules
├── README.md             # Comprehensive documentation
├── api-demo.js           # API demonstration script
├── test-script.ts        # Manual testing script
└── context.txt           # Original problem description
```

### 🚀 Key Features

#### 1. **Core Algorithm** (`src/solver.ts`)

- ✅ Efficient solution for Manhattan distance calculation
- ✅ Two implementations: basic and optimized
- ✅ Early termination for performance
- ✅ Processing time measurement
- ✅ Full input validation

#### 2. **REST API** (`src/app.ts`)

- ✅ Express.js server with TypeScript
- ✅ CORS and security middleware (Helmet)
- ✅ Rate limiting protection
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ Examples endpoint
- ✅ Main solver endpoint

#### 3. **Type Safety** (`src/types.ts`)

- ✅ Complete TypeScript interfaces
- ✅ Custom error classes
- ✅ Request/Response types
- ✅ Position and Matrix types

#### 4. **Utilities** (`src/utils.ts`)

- ✅ Input validation with detailed error messages
- ✅ Manhattan distance calculation
- ✅ Matrix utility functions
- ✅ House and empty plot finding
- ✅ Store location validation

#### 5. **Comprehensive Testing**

- ✅ Jest testing framework
- ✅ Unit tests for all components
- ✅ API integration tests with Supertest
- ✅ Test coverage reporting
- ✅ Example validation tests

#### 6. **Developer Experience**

- ✅ TypeScript with strict configuration
- ✅ ESLint for code quality
- ✅ VS Code tasks for easy development
- ✅ Hot reload development server
- ✅ Build scripts for production

### 📋 API Endpoints

1. **GET /health** - Health check
2. **GET /api/examples** - Get usage examples
3. **POST /api/store-locations** - Find valid store locations
4. **GET /api-docs** - Swagger UI documentation
5. **GET /api-docs.json** - OpenAPI JSON specification

### 📚 API Documentation

The API includes comprehensive **Swagger/OpenAPI documentation** accessible at:

- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://your-app.run.app/api-docs`

Features:

- **Interactive API testing** directly from the browser
- **Complete schema documentation** for all endpoints
- **Example requests and responses**
- **Validation rules** and constraints
- **Authentication details** (when applicable)

### 🧪 Examples Implemented

All three examples from the problem description work correctly:

1. **Example 1**: K=2, returns 2 valid locations
2. **Example 2**: K=1, returns 2 valid locations
3. **Example 3**: K=4, returns 8 valid locations

### ⚡ Performance

- Handles matrices up to 400×400 as specified
- Optimized algorithm with early termination
- Processing time measurement included
- Memory efficient implementation

### 🛡️ Validation & Error Handling

- K value validation (1-800 range)
- Matrix dimension validation (2-400 range)
- Matrix content validation (0/1 values only)
- At least one house requirement
- Comprehensive error messages
- HTTP status codes
- Field-specific error reporting

## 🚀 How to Use

### Installation & Setup

```bash
cd d:\manhattan-distance-challenge
npm install
npm run build
```

### Running Tests

```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage
npm run test:watch      # Watch mode
```

### Development

```bash
npm run dev            # Start development server
npm run lint           # Check code quality
npm run lint:fix       # Fix linting issues
```

### Production

```bash
npm start              # Start production server
```

### API Usage Example

```bash
# Start the server
npm run dev

# Test the API
curl -X POST http://localhost:3000/api/store-locations \
  -H "Content-Type: application/json" \
  -d '{
    "k": 2,
    "matrix": [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 0, 0, 1]
    ]
  }'
```

### Programming Usage

```typescript
import { StoreLocationSolver } from "./src/solver";

const result = StoreLocationSolver.solve(2, [
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [1, 0, 0, 1],
]);

console.log(`Found ${result.count} valid locations`);
```

## ✅ All Requirements Met

- ✅ **Algorithm**: Efficient Manhattan distance calculation
- ✅ **Constraints**: All input constraints properly validated
- ✅ **Examples**: All provided examples work correctly
- ✅ **TypeScript**: Full type safety throughout
- ✅ **API**: RESTful endpoints with proper error handling
- ✅ **Tests**: Comprehensive test suite with good coverage
- ✅ **Documentation**: Complete README and code comments
- ✅ **Performance**: Optimized for large inputs
- ✅ **Swagger**: Interactive API documentation with OpenAPI 3.0
- ✅ **Docker**: Multi-stage build with security best practices
- ✅ **Cloud Ready**: Google Cloud Run deployment configuration
- ✅ **CI/CD**: GitHub Actions workflow for automated deployment

## 🐳 Docker & Deployment

The application is fully containerized and cloud-ready:

### Docker Features

- **Multi-stage build** for optimized image size
- **Non-root user** for security
- **Health checks** built-in
- **Proper signal handling** with dumb-init
- **Production-ready** configuration

### Google Cloud Run

- **Automatic scaling** (0 to 10 instances)
- **Pay-per-request** pricing model
- **HTTPS** enabled by default
- **Global CDN** integration
- **Zero-downtime deployments**

### CI/CD Pipeline

- **Automated testing** on every push
- **Docker image building** and pushing
- **Deployment to Cloud Run** on main branch
- **Health check validation**

## 🎯 Next Steps

The application is production-ready! You can:

1. **Deploy to Google Cloud Run** using the provided CI/CD pipeline
2. **View API documentation** at `/api-docs`
3. **Test with Docker** locally using `docker-compose up`
4. **Monitor performance** with Cloud Run metrics
5. **Scale automatically** based on demand
6. **Add authentication** if needed
7. **Configure custom domain** for production use
8. **Set up monitoring** and alerting

### Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server with Swagger docs
npm run dev
# Visit: http://localhost:3000/api-docs

# Build and run with Docker
docker-compose up
# Visit: http://localhost:3000/api-docs

# Deploy to Google Cloud Run
# Push to main branch (CI/CD will handle deployment)
git push origin main
```

This is a complete, professional-grade implementation of the Manhattan distance challenge with excellent developer experience and production-ready features.
