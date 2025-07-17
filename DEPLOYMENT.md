# Manhattan Distance API - Deployment Guide

## 🚀 Swagger Documentation

The API now includes comprehensive Swagger documentation accessible at:

- **Local Development**: `http://localhost:3000/api-docs`
- **Production**: `https://your-app.run.app/api-docs`

### API Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/health`              | Health check               |
| GET    | `/api/examples`        | Usage examples             |
| POST   | `/api/store-locations` | Find valid store locations |
| GET    | `/api-docs`            | Swagger UI documentation   |
| GET    | `/api-docs.json`       | OpenAPI JSON specification |

## 🐳 Docker Deployment

### Local Docker Build and Run

```bash
# Build the Docker image
docker build -t manhattan-distance-api .

# Run the container
docker run -p 3000:3000 manhattan-distance-api

# Using docker-compose (recommended for development)
docker-compose up

# With nginx (optional)
docker-compose --profile with-nginx up
```

### Docker Image Features

- **Multi-stage build** for optimized image size
- **Non-root user** for security
- **Health checks** built-in
- **Proper signal handling** with dumb-init
- **Production-ready** configuration

## ☁️ Google Cloud Run Deployment

### Prerequisites

1. **Google Cloud Account** with billing enabled
2. **GCP Project** created
3. **APIs enabled**:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

### Setup Instructions

#### 1. Install Google Cloud SDK

```bash
# Install gcloud CLI
# Visit: https://cloud.google.com/sdk/docs/install
```

#### 2. Setup GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 3. Create Service Account for GitHub Actions

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download service account key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
```

#### 4. Configure GitHub Secrets

Add these secrets to your GitHub repository:

- `GCP_SA_KEY`: Contents of `github-actions-key.json`
- `GCP_PROJECT_ID`: Your GCP project ID

#### 5. Manual Deployment (Optional)

```bash
# Build and push image
docker build -t gcr.io/$PROJECT_ID/manhattan-distance-api:latest .
docker push gcr.io/$PROJECT_ID/manhattan-distance-api:latest

# Deploy to Cloud Run
gcloud run deploy manhattan-distance-api \
  --image gcr.io/$PROJECT_ID/manhattan-distance-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1000m \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# Ensure public access (important for no-auth access)
gcloud run services add-iam-policy-binding manhattan-distance-api \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/deploy-cloudrun.yml`) that:

1. **Tests** the application
2. **Builds** Docker image
3. **Pushes** to Google Container Registry
4. **Deploys** to Cloud Run

### Environment Variables

| Variable   | Description      | Default      |
| ---------- | ---------------- | ------------ |
| `NODE_ENV` | Node environment | `production` |
| `PORT`     | Server port      | `3000`       |

### Health Checks

The application includes comprehensive health checks:

- **Docker**: Built-in health check
- **Cloud Run**: Automatic health monitoring
- **Endpoint**: `GET /health`

### Security Features

- **Rate limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for security
- **Helmet**: Security headers
- **Non-root user**: Docker security
- **Input validation**: Comprehensive validation
- **Public access**: Configured for unauthenticated access

### Public Access Configuration

The service is configured for **public access without authentication**:

1. **`--allow-unauthenticated`** flag during deployment
2. **IAM policy binding** for `allUsers` with `roles/run.invoker`
3. **No authentication required** for any endpoints

To verify public access:

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe manhattan-distance-api --region us-central1 --format 'value(status.url)')

# Test public access
curl $SERVICE_URL/health
curl $SERVICE_URL/api/examples
```

### Monitoring

Cloud Run provides built-in monitoring:

- **Metrics**: Request count, latency, errors
- **Logs**: Centralized logging
- **Alerts**: Configure as needed

### Scaling

Cloud Run auto-scales based on demand:

- **Min instances**: 0 (scales to zero)
- **Max instances**: 10 (configurable)
- **CPU**: 1000m (1 vCPU)
- **Memory**: 512Mi

### Cost Optimization

- **Scales to zero** when not in use
- **Pay per request** model
- **Optimized Docker image** size
- **Efficient algorithms** for fast response times

## 🧪 Testing the Deployment

### Test Public Access

After deployment, verify that your service is publicly accessible:

```bash
# Using the provided test script (Linux/Mac)
./test-public-access.sh your-project-id

# Using PowerShell (Windows)
.\test-public-access.ps1 -ProjectId "your-project-id"

# Or using npm script (Windows)
npm run test:public-access your-project-id
```

### Test API Endpoints Manually

```bash
# Health check
curl https://your-app.run.app/health

# Get examples
curl https://your-app.run.app/api/examples

# Test store location API
curl -X POST https://your-app.run.app/api/store-locations \
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

### Performance Testing

```bash
# Load test with Apache Bench
ab -n 1000 -c 10 https://your-app.run.app/health

# Load test the main endpoint
ab -n 100 -c 5 -p test-payload.json -T application/json \
  https://your-app.run.app/api/store-locations
```

## 🎯 Next Steps

1. **Custom Domain**: Configure custom domain in Cloud Run
2. **CDN**: Add Cloud CDN for better performance
3. **Authentication**: Add authentication if needed
4. **Database**: Add database for storing results
5. **Monitoring**: Set up alerting and monitoring
6. **SSL**: Configure SSL certificates (automatic in Cloud Run)

## 📖 Documentation

- **Swagger UI**: `/api-docs`
- **OpenAPI Spec**: `/api-docs.json`
- **Health Check**: `/health`
- **Examples**: `/api/examples`

## 🔧 Troubleshooting

### Common Issues

1. **Build fails**: Check TypeScript compilation
2. **Docker build fails**: Verify Dockerfile and dependencies
3. **Deployment fails**: Check GCP permissions and quotas
4. **Health checks fail**: Verify `/health` endpoint
5. **403 Forbidden errors**: Check public access configuration

### Public Access Troubleshooting

If you get 403 Forbidden errors when accessing the service:

```bash
# Check current IAM policy
gcloud run services get-iam-policy manhattan-distance-api --region us-central1

# Add public access if missing
gcloud run services add-iam-policy-binding manhattan-distance-api \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# Verify the service allows unauthenticated access
gcloud run services describe manhattan-distance-api --region us-central1 \
  --format="value(spec.template.metadata.annotations['run.googleapis.com/ingress'])"
```

### Debug Commands

```bash
# Check Docker logs
docker logs <container-id>

# Check Cloud Run logs
gcloud run services logs tail manhattan-distance-api --region us-central1

# Test health check
curl -v http://localhost:3000/health
```
