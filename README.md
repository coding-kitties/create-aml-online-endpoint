# Create Azure Machine Learning Online Endpoint - GitHub Action

This GitHub Action creates an **Azure Machine Learning Online Endpoint**.

Features:

* Create an Azure Machine Learning Online Endpoint
* Check if endpoint already exists, only update if it doesn't
* Checks if resource group, workspace and endpoint exist

For other Azure Machine Learning related github actions check out:

* [create-azure-machine-learning-deployment](https://github.com/coding-kitties/create-azure-machine-learning-deployment)

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
        uses: coding-kitties/create-azure-machine-learning-online-endpoint@v0.3.0
        with:
          endpoint_name: 'my-endpoint'
          resource_group: 'my-resource-group'
          workspace_name: 'my-workspace'
```
