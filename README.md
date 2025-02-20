# Create Azure Machine Learning Online Endpoint - GitHub Action

This GitHub Action creates an **Azure Machine Learning Online Endpoint**.

## Dependencies on other Github Actions

* Authenticate using [Azure Login](https://github.com/Azure/login)

## 🚀 Usage

### **1. Add to Your Workflow**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
     - uses: actions/checkout@v2.3.2
     - uses: Azure/login@v1
       with:
         creds: ${{secrets.AZURE_CREDENTIALS}}

      - name: Create AML Online Endpoint
        uses: coding-kitties/create-aml-online-endpoint@v0.2.0
        with:
          endpoint_name: 'my-endpoint'
          resource_group: 'my-resource-group'
          workspace_name: 'my-workspace'
```
