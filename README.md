# Create Azure Machine Learning Online Endpoint - GitHub Action

This GitHub Action creates an **Azure Machine Learning Online Endpoint**.

## 🚀 Usage

### **1. Add to Your Workflow**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Create AML Online Endpoint
        uses: coding-kitties/create-aml-online-endpoint@v1
        with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          endpoint_name: 'my-endpoint'
          resource_group: 'my-resource-group'
          workspace_name: 'my-workspace'
```
