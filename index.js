import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function checkIfEndpointExists(endpointName, resourceGroup, workspaceName) {
    try {
        let output = "";
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                }
            },
            silent: true
        };

        // Check if the endpoint exists
        await exec.exec(`az ml online-endpoint show --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`, [], options);

        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

async function checkIfResourceGroupExists(resourceGroup) {
    try {
        let output = "";
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                }
            },
            silent: true
        };

        // Check if the resource group exists
        await exec.exec(`az group show --name ${resourceGroup}`, [], options);
        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

async function checkIfWorkspaceExists(workspaceName, resourceGroup) {
    try {
        let output = "";
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml workspace show --name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

try {
    const endpointName = core.getInput("endpoint_name");
    const resourceGroup = core.getInput("resource_group");
    const workspaceName = core.getInput("workspace_name");

    // Check if the required inputs are provided
    if (!endpointName) {
        throw new Error("Endpoint name is required.");
    }

    if (!resourceGroup) {
        throw new Error("Resource group is required");
    }

    if (!workspaceName) {
        throw new Error("Workspace name is required");
    }

    // Check if the resource group exists
    console.log(`🔹 Checking if resource group '${resourceGroup}' exists...`)
    ;
    const resourceGroupExists = await checkIfResourceGroupExists(resourceGroup);
    if (!resourceGroupExists) {
        throw new Error(`Resource group '${resourceGroup}' does not exist.`);
    }

    // Check if the workspace exists
    console.log(`🔹 Checking if workspace '${workspaceName}' exists in resource group '${resourceGroup}'...`)
    ;
    const workspaceExists = await checkIfWorkspaceExists(workspaceName, resourceGroup);

    if (!workspaceExists) {
        throw new Error(`Workspace '${workspaceName}' does not exist in resource group '${resourceGroup}'.`);
    }

    console.log(`🔹 Checking if endpoint '${endpointName}' exists...`);
    const exists = await endpointExists(
        endpointName, resourceGroup, workspaceName
    );

    if (exists) {
        console.log(`✅ Endpoint '${endpointName}' already exists. Skipping creation.`);
    } else {
        console.log(`🔹 Creating endpoint '${endpointName}'...`);
        await exec.exec(`az ml online-endpoint create --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`);
        console.log(`✅ Successfully created endpoint: ${endpointName}`);
    }

} catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
}
