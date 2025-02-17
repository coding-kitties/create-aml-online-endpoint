#!/bin/bash
set -e

# Log into Azure using the provided credentials
echo "Logging into Azure..."
echo "$1" > azure_credentials.json
az login --service-principal --username $(jq -r .clientId azure_credentials.json) --password $(jq -r .clientSecret azure_credentials.json) --tenant $(jq -r .tenantId azure_credentials.json)

local endpoint="$2"                 # The endpoint to which the deployment belongs
local workspace="$3"                # The machine learning workspace name where the endpoint belongs
local resourceGroup="$4"            # The resource group where the deployment and endpoint belong

# Set up Azure CLI and ML extension
echo "Setting up Azure CLI..."
az account show
az extension add --name ml -y

echo "Creating Endpoint $endpoint in Workspace $workspace in Resource Group $resourceGroup..."

# Check if workspace exists
local workspaceExists
workspaceExists=$(az ml workspace show \
    --resource-group "$resourceGroup" \
    --workspace-name "$workspace" 2>/dev/null)

if [ -z "$workspaceExists" ]; then
    echo "Workspace $workspace does not exist. Cannot deploy endpoint."
    exit 1
fi

# Check if endpoint already exists
local endpointExists
endpointExists=$(az ml online-endpoint show \
    --name "$endpoint" \
    --resource-group "$resourceGroup" \
    --workspace-name "$workspace" 2>/dev/null)

if [ -n "$endpointExists" ]; then
    echo "Endpoint $endpoint exists; updating the endpoint"
    az ml online-endpoint update \
        --name "$endpoint" \
        --file endpoint-apply.yaml \
        --resource-group "$resourceGroup" \
        --workspace-name "$workspace"
else
    echo "Creating endpoint $endpoint"
    cat endpoint-apply.yml
    az ml online-endpoint create \
        --file endpoint-apply.yaml \
        --resource-group "$resourceGroup" \
        --workspace-name "$workspace"
fi

endpointExists=$(az ml online-endpoint show \
        --name "$endpoint" \
        --resource-group "$resourceGroup" \
        --workspace-name "$workspace" 2>/dev/null)

if [ -n "$endpointExists" ]; then
    echo "Endpoint $endpoint created successfully"
    exit 0
else
    echo "Endpoint $endpoint creation failed"
    exit 1
fi
