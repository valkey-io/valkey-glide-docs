# Valkey Glide Documentation Generator

## Overview

This repository contains a set of shell scripts designed to automatically generate API documentation for the various Valkey Glide Clients in different programming languages.

- **Node.js/TypeScript**: using TypeDoc
- **Java**: using Javadoc
- **Python**: using Mkdocs
- **Go**: **None** - Docs are available on [pkg.dev.com](https://pkg.go.dev/)

The main script `build-docs.sh` orchestrates the generation process by executing all language-specific documentation builders in parallel. Additionally, a test deployment script `test-deploy.sh` is provided to integrate the generated docs with the regular documentations content for verification.

## Prerequisites

Before running these scripts, ensure you have the following installed on your system:

### Requirements

- **Git** - for cloning the Valkey Glide repository
- SSH access to Valkey Glide Github repository as the scripts will clone the folder.
- JDK, npm, pnpm Python3, and other requirements to build each clients.

## How to Generate Documentation

### Generate All Client Documentation

First, clone the Valkey GLIDE repository into the `doc-gen` folder.
The scripts expects Valkey GLIDE repo to be in `doc-gen`.

```bash
cd doc-gen
git clone --depth 1 --branch main <valkey-glide-repo-ssh>
```

To generate documentation for all clients:

```bash
./build-docs.sh
```

This script will generate documentations from the source codes the clients. This process can take a long time.

For developement purposes, you may not need the latest docs all the time. As such, building the docs once should be enough.

### Generate Documentation for Individual Clients

You can also generate documentation for specific clients by running the individual scripts:

#### Node.js Documentation

```bash
./build-node-docs.sh
```

Output location: `./docs/node/`

#### Java Documentation

```bash
./build-java-docs.sh
```

Output location: `./docs/java/`

#### Python Documentation

```bash
./build-python-docs.sh
```

Output location: `./docs/python/`

## How to Use test-deploy.sh

The `test-deploy.sh` script spin up a test server to serve the Valkey GLIDE Docs site with the doc-gens deployed.
This is because astro dev server could not serve our doc-gen files.

```bash
./test-deploy.sh
```

After running the script, open your browser and navigate to:

```
http://localhost:8000/valkey-glide-docs/
```

You can now browse and verify the complete documentation site with all API references integrated.

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
