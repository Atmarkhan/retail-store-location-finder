#!/bin/bash

# Public Access Test Script for Cloud Run Deployment
# This script tests if the deployed service is publicly accessible without authentication

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌐 Testing Public Access to Cloud Run Service${NC}"
echo "================================================="

# Configuration
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME="manhattan-distance-api"
REGION="us-central1"

if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo -e "${YELLOW}⚠️  Please provide your GCP project ID as the first argument${NC}"
    echo "Usage: $0 <project-id>"
    exit 1
fi

echo "Project ID: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Get service URL
echo -e "${YELLOW}🔍 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)' 2>/dev/null)

if [ -z "$SERVICE_URL" ]; then
    echo -e "${RED}❌ Service not found or not accessible${NC}"
    echo "Make sure the service is deployed and you have the correct project ID"
    exit 1
fi

echo -e "${GREEN}✅ Service URL: $SERVICE_URL${NC}"
echo ""

# Test health endpoint
echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed (HTTP $HEALTH_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_RESPONSE)${NC}"
fi

# Test examples endpoint
echo -e "${YELLOW}📚 Testing examples endpoint...${NC}"
EXAMPLES_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api/examples")
if [ "$EXAMPLES_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Examples endpoint accessible (HTTP $EXAMPLES_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Examples endpoint failed (HTTP $EXAMPLES_RESPONSE)${NC}"
fi

# Test Swagger documentation
echo -e "${YELLOW}📖 Testing Swagger documentation...${NC}"
SWAGGER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api-docs")
if [ "$SWAGGER_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Swagger documentation accessible (HTTP $SWAGGER_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Swagger documentation failed (HTTP $SWAGGER_RESPONSE)${NC}"
fi

# Test main API endpoint
echo -e "${YELLOW}🧮 Testing main API endpoint...${NC}"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SERVICE_URL/api/store-locations" \
  -H "Content-Type: application/json" \
  -d '{
    "k": 2,
    "matrix": [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 0, 0, 1]
    ]
  }')
if [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Main API endpoint working (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Main API endpoint failed (HTTP $API_RESPONSE)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Public Access Test Complete!${NC}"
echo "================================================="
echo -e "${GREEN}📱 Access your API at:${NC}"
echo "   Health: $SERVICE_URL/health"
echo "   Examples: $SERVICE_URL/api/examples"
echo "   Swagger: $SERVICE_URL/api-docs"
echo "   Main API: $SERVICE_URL/api/store-locations"
echo ""

# Check IAM policy
echo -e "${YELLOW}🔐 Checking IAM policy for public access...${NC}"
IAM_POLICY=$(gcloud run services get-iam-policy $SERVICE_NAME --region $REGION --project $PROJECT_ID --format="value(bindings[].members)" 2>/dev/null)
if echo "$IAM_POLICY" | grep -q "allUsers"; then
    echo -e "${GREEN}✅ Public access correctly configured (allUsers has access)${NC}"
else
    echo -e "${RED}❌ Public access may not be configured${NC}"
    echo "Run this command to fix:"
    echo "gcloud run services add-iam-policy-binding $SERVICE_NAME \\"
    echo "  --region $REGION \\"
    echo "  --member=\"allUsers\" \\"
    echo "  --role=\"roles/run.invoker\""
fi

echo ""
echo -e "${GREEN}✨ All done! Your service should be publicly accessible.${NC}"
