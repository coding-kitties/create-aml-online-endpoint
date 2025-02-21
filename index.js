import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function checkIfEndpointExists(endpointName, resourceGroup, workspaceName) {
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the endpoint exists
        await exec.exec(`az ml online-endpoint show --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`, [], options);

        console.log("✅ Endpoint already exists. Output:", output);
        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

async function checkIfResourceGroupExists(resourceGroup) {
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };
        // Execute the Azure CLI command
        await exec.exec(`az group show --name ${resourceGroup} --resource-group ${resourceGroup}`, [], options);

        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false; // Return false if the workspace does not exist
    }
}

async function checkIfWorkspaceExists(workspaceName, resourceGroup) {
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml workspace show --name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
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
    } else {
        console.log(`✅ Resource group '${resourceGroup}' exists.`);
    }

    // Check if the workspace exists
    console.log(`🔹 Checking if workspace '${workspaceName}' exists in resource group '${resourceGroup}'...`)
    ;
    const workspaceExists = await checkIfWorkspaceExists(workspaceName, resourceGroup);

    if (!workspaceExists) {
        throw new Error(`Workspace '${workspaceName}' does not exist in resource group '${resourceGroup}'.`);
    } else {
        console.log(`✅ Workspace '${workspaceName}' exists in resource group '${resourceGroup}'.`);
    }

    console.log(`🔹 Checking if endpoint '${endpointName}' exists...`);
    const exists = await checkIfEndpointExists(
        endpointName, resourceGroup, workspaceName
    );

    if (exists) {
        console.log(`✅ Endpoint '${endpointName}' already exists. Skipping creation.`);
    } else {
        console.log(`🔹 Endpoint does not exist, creating it ...`)
        await exec.exec(`az ml online-endpoint create --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`);
        console.log(`✅ Successfully created endpoint: ${endpointName}`);
    }

} catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
}
