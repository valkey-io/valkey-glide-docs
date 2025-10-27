# Valkey Glide Documentation Generator

## Overview

This repository contains a set of shell scripts designed to automatically generate API documentation for the various Valkey Glide Clients in different programming languages.

- **Node.js/TypeScript**: using TypeDoc
- **Java**: using Javadoc
- **Python**: using Mkdocs
- **Go**: None. Docs are available on [pkg.dev.com](https://pkg.go.dev/)

The main script `build-docs.sh` orchestrates the generation process by cloning the Valkey Glide repository and executing language-specific documentation builders in parallel. Additionally, a test deployment script `test-deploy.sh` is provided to integrate the generated docs with the regular documentations content for verification.

## Prerequisites

Before running these scripts, ensure you have the following installed on your system:

### Requirements
- **Git** - for cloning the Valkey Glide repository
- SSH access to Valkey Glide Github repository as the scripts will clone the folder.
- JDK, npm, pnpm Python3, and other requirements to build each clients.

## How to Generate Documentation

### Generate All Client Documentation

To generate documentation for all clients (Node.js, Java, and Python):

```bash
./build-docs.sh
```

This script will:
1. Remove any existing `valkey-glide` directory
2. Perform a shallow clone of the Valkey Glide repository
3. Execute all language-specific documentation builders in parallel
4. Output documentation to `./docs/node/`, `./docs/java/`, and `./docs/python/`

### Generate Documentation for Individual Clients

You can also generate documentation for specific clients by running the individual scripts:

#### Node.js Documentation
```bash
./build-node-docs.sh [optional-path-to-node-client]
```
Output location: `./docs/node/`

#### Java Documentation
```bash
./build-java-docs.sh [optional-path-to-java-client]
```
Output location: `./docs/java/`

#### Python Documentation
```bash
./build-python-docs.sh [optional-path-to-python-client]
```
Output location: `./docs/python/`

**Note:** Each script accepts an optional parameter to specify a custom path to the client directory. If not provided, the scripts will use the default path from the cloned `valkey-glide` repository.

## How to Use test-deploy.sh

The `test-deploy.sh` script provides a complete end-to-end workflow for building, generating, and locally testing the Valkey Glide documentation website.

### Running the Test Deployment

```bash
./test-deploy.sh
```

### What It Does

1. **Cleanup** - Removes existing test directories and API documentation
2. **Build Process** - Builds the main Valkey Glide documentation site using pnpm
3. **Generate API Docs** - Runs `build-docs.sh` to generate all client API documentation
4. **Copy Files** - Assembles the complete documentation structure:
   - Copies built site from `../dist` to `./test/valkey-glide-docs/`
   - Copies Node.js API docs to `./test/valkey-glide-docs/languages/nodejs/api/`
   - Copies Java API docs to `./test/valkey-glide-docs/languages/java/api/`
   - Copies Python API docs to `./test/valkey-glide-docs/languages/python/api/`
5. **Start Server** - Launches a local HTTP server on port 8000

### Viewing the Documentation

After running the script, open your browser and navigate to:
```
http://localhost:8000/valkey-glide-docs/
```

You can now browse and verify the complete documentation site with all API references integrated.

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the HTTP server.

## Output Structure

After running the documentation generation scripts, the following directory structure will be created:

```
docs/
├── node/       # Node.js/TypeScript API documentation
├── java/       # Java API documentation
└── python/     # Python API documentation

test/
└── valkey-glide-docs/  # Complete documentation site (test-deploy only)
    └── languages/
        ├── nodejs/api/
        ├── java/api/
        └── python/api/
```