FROM mcr.microsoft.com/azure-cli

LABEL "com.github.actions.name"="Create Azure Machine Learning Workspace Endpoint"
LABEL "com.github.actions.description"="Create an Azure Machine Learning Workspace Endpoint"
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="green"
LABEL "repository"="https://github.com/coding-kitties/create-aml-online-endpoint"
LABEL "homepage"="https://github.com/coding-kitties/create-aml-online-endpoint"
LABEL "maintainer"="Marc van Duyn <marcvanduyn@microsoft.com>"

# Install jq (for parsing JSON)
RUN apt-get update && apt-get install -y jq

# Install Azure ML CLI extension
RUN az extension add --name ml -y

# Set the working directory
WORKDIR /workspace

# Copy the entrypoint script into the container
COPY entrypoint.sh /workspace/entrypoint.sh

# Set the entrypoint script to be executable
RUN chmod +x /workspace/entrypoint.sh

# Define default command
ENTRYPOINT ["/workspace/entrypoint.sh"]
