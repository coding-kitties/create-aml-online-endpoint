FROM mcr.microsoft.com/azure-cli

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
