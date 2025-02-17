# Deploy AML Online Endpoint - GitHub Action

This GitHub Action deploys an **Azure Machine Learning Online Endpoint** using **Azure CLI** (via a Bash script).

## 🚀 Usage

### **1. Add to Your Workflow**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy AML Online Endpoint
        uses: coding-kitties/create-aml-online-endpoint@v1
        with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          resource_group: 'my-resource-group'
          workspace_name: 'my-workspace'
          endpoint_file: './config/endpoint.yml'
          deployment_file: './config/deployment.yml'
```
