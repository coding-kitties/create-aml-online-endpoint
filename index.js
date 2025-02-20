const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
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

    console.log(`🔹 Deploying AML Endpoint: ${endpointName}`);

    // Run Azure CLI command
    await exec.exec(`az ml online-endpoint create --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`);

    console.log(`✅ Successfully deployed: ${endpointName}`);
  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

run();