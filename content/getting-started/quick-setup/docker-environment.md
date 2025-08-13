---
title: Quick Setup
---

# Quick Setup

This guide will help you install Valkey GLIDE and set up your development environment. We'll also show you how to start a local Valkey server for testing.

## Prerequisites

Before installing GLIDE, ensure you have the following:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

**Requirements:**
- Python 3.8 or higher
- pip package manager

**Check your Python version:**
```bash
python --version
# or
python3 --version
```

</div>
<div class="tab-content" data-label="Java">

**Requirements:**
- Java 11 or higher
- Maven 3.6+ or Gradle 6.0+

**Check your Java version:**
```bash
java -version
javac -version
```

</div>
<div class="tab-content" data-label="Node.js">

**Requirements:**
- Node.js 16.0 or higher
- npm or yarn package manager

**Check your Node.js version:**
```bash
node --version
npm --version
```

</div>
<div class="tab-content" data-label="Go">

**Requirements:**
- Go 1.19 or higher

**Check your Go version:**
```bash
go version
```

</div>
</div>

## Step 1: Start a Local Valkey Server

For this tutorial, we'll use Docker to run a local Valkey server. This is the quickest way to get started.

### Using Docker

```bash
# Pull and run Valkey server
docker run -d --name valkey-server -p 6379:6379 valkey/valkey:latest

# Verify it's running
docker ps
```

### Verify Connection

Test that your server is running:

```bash
docker exec valkey-server valkey-cli ping
# Expected output: PONG
```

## Step 2: Install Valkey GLIDE

Now let's install GLIDE for your chosen language:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

### Install via pip

```bash
# Install the latest version
pip install valkey-glide

# Or install a specific version
pip install valkey-glide==1.3.0
```

### Verify Installation

```python
# Create a test file: test_glide.py
from glide import __version__
print(f"Valkey GLIDE version: {__version__}")
```

```bash
# Run the test
python test_glide.py
```

### Virtual Environment (Recommended)

```bash
# Create a virtual environment
python -m venv glide-env

# Activate it (Linux/Mac)
source glide-env/bin/activate

# Activate it (Windows)
glide-env\Scripts\activate

# Install GLIDE
pip install valkey-glide
```

</div>
<div class="tab-content" data-label="Java">

### Maven Setup

Add to your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>io.valkey</groupId>
        <artifactId>valkey-glide</artifactId>
        <version>1.3.0</version>
    </dependency>
</dependencies>
```

### Gradle Setup

Add to your `build.gradle`:

```gradle
dependencies {
    implementation 'io.valkey:valkey-glide:1.3.0'
}
```

### Verify Installation

Create a test file `TestGlide.java`:

```java
import glide.api.GlideClient;

public class TestGlide {
    public static void main(String[] args) {
        System.out.println("Valkey GLIDE is ready!");
    }
}
```

Compile and run:
```bash
javac -cp "path/to/valkey-glide.jar" TestGlide.java
java -cp ".:path/to/valkey-glide.jar" TestGlide
```

</div>
<div class="tab-content" data-label="Node.js">

### Install via npm

```bash
# Install the latest version
npm install @valkey/valkey-glide

# Or install a specific version
npm install @valkey/valkey-glide@1.3.0
```

### Install via yarn

```bash
# Install the latest version
yarn add @valkey/valkey-glide
```

### Verify Installation

Create a test file `test-glide.js`:

```javascript
const { GlideClient } = require('@valkey/valkey-glide');
console.log('Valkey GLIDE is ready!');
```

Run the test:
```bash
node test-glide.js
```

### TypeScript Support

GLIDE includes TypeScript definitions out of the box:

```bash
# No additional @types package needed
npm install @valkey/valkey-glide
```

</div>
<div class="tab-content" data-label="Go">

### Install via go get

```bash
# Initialize a new Go module (if needed)
go mod init your-project-name

# Install GLIDE
go get github.com/valkey-io/valkey-glide/go
```

### Verify Installation

Create a test file `main.go`:

```go
package main

import (
    "fmt"
    "github.com/valkey-io/valkey-glide/go/glide/api"
)

func main() {
    fmt.Println("Valkey GLIDE is ready!")
}
```

Run the test:
```bash
go run main.go
```

</div>
</div>

## Step 3: Create Your First Project

Let's create a simple project structure:

<div class="code-tabs" data-labels='["Python","Java","Node.js","Go"]'>
<div class="tab-content" data-label="Python">

```bash
# Create project directory
mkdir valkey-glide-tutorial
cd valkey-glide-tutorial

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install GLIDE
pip install valkey-glide

# Create main file
touch main.py
```

</div>
<div class="tab-content" data-label="Java">

```bash
# Create project directory
mkdir valkey-glide-tutorial
cd valkey-glide-tutorial

# Create Maven project structure
mkdir -p src/main/java/com/example
touch pom.xml
touch src/main/java/com/example/Main.java
```

</div>
<div class="tab-content" data-label="Node.js">

```bash
# Create project directory
mkdir valkey-glide-tutorial
cd valkey-glide-tutorial

# Initialize npm project
npm init -y

# Install GLIDE
npm install @valkey/valkey-glide

# Create main file
touch index.js
```

</div>
<div class="tab-content" data-label="Go">

```bash
# Create project directory
mkdir valkey-glide-tutorial
cd valkey-glide-tutorial

# Initialize Go module
go mod init valkey-glide-tutorial

# Install GLIDE
go get github.com/valkey-io/valkey-glide/go

# Create main file
touch main.go
```

</div>
</div>

## Troubleshooting

### Common Issues

**Connection Refused**
- Ensure your Valkey/Redis server is running on port 6379
- Check if Docker container is running: `docker ps`

**Import/Package Errors**
- Verify the package is installed correctly
- Check your language version meets requirements
- For Python: ensure you're in the correct virtual environment

**Permission Errors**
- On Linux/Mac, you might need `sudo` for global installations
- Consider using virtual environments (Python) or user-local installations

### Getting Help

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/valkey-io/valkey-glide/issues)
2. Join the [Valkey Slack Community](https://join.slack.com/t/valkey-oss-developer/shared_invite/zt-2nxs51chx-EB9hu9Qdch3GMfRcztTSkQ)
3. Review the [troubleshooting guide](../reference/error-codes.html)

## What's Next?

Now that you have GLIDE installed and a Valkey server running, let's [make your first connection](first-connection.html) and start executing commands!

---

**Previous**: [← What is Valkey GLIDE?](overview.html) | **Next**: [First Connection →](first-connection.html)
