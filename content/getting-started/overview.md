---
title: What is Valkey GLIDE?
---
# Welcome to Valkey GLIDE!

Valkey General Language Independent Driver for the Enterprise (GLIDE) is the official open-source Valkey client library, proudly part of the Valkey organization. Our mission is to make your experience with Valkey and Redis OSS seamless and enjoyable. Whether you're a seasoned developer or just starting out, Valkey GLIDE is here to support you every step of the way.

## Why Choose Valkey GLIDE?

- **Community and Open Source**: Join our vibrant community and contribute to the project. We are always here to respond, and the client is for the community.
- **Reliability**: Built with best practices learned from over a decade of operating Redis OSS-compatible services.
- **Performance**: Optimized for high performance and low latency.
- **High Availability**: Designed to ensure your applications are always up and running.
- **Cross-Language Support**: Implemented using a core driver framework written in Rust, with language-specific extensions to ensure consistency and reduce complexity.
- **Stability and Fault Tolerance**: We brought our years of experience to create a bulletproof client.
- **Backed and Supported by AWS and GCP**: Ensuring robust support and continuous improvement of the project.

## Key Features
- **[AZ Affinity](https://valkey.io/blog/az-affinity-strategy/)** – Ensures low-latency connections and minimal cross-zone costs by routing read traffic to replicas in the clients availability zone. **(Requires Valkey server version 8.0+ or AWS ElastiCache for Valkey 7.2+)**.
- **[PubSub Auto-Reconnection](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#pubsub-support:~:text=PubSub%20Support,Receiving%2C%20and%20Unsubscribing.)** – Seamless background resubscription on topology updates or disconnection.
- **[Sharded PubSub](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#pubsub-support:~:text=Receiving%2C%20and%20Unsubscribing.-,Subscribing,routed%20to%20the%20server%20holding%20the%20slot%20for%20the%20command%27s%20channel.,-Receiving)** – Native support for sharded PubSub across cluster slots.
- **[Cluster-Aware MGET/MSET/DEL/FLUSHALL](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#multi-slot-command-handling:~:text=Multi%2DSlot%20Command%20Execution,JSON.MGET)** – Execute multi-key commands across cluster slots without manual key grouping.
- **[Cluster Scan](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#cluster-scan)** – Unified key iteration across shards using a consistent, high-level API for cluster environments.
- **Support for TS / CJS / MJS** – Fully compatible with modern and legacy JavaScript/TypeScript runtimes.
- **Support for asyncio / anyio / trio** – Native compatibility with modern Python async frameworks, enabling efficient and seamless integration into asynchronous workflows.
- **[Batching (Pipeline and Transaction)](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#batching-pipeline-and-transaction)** – Efficiently execute multiple commands in a single network roundtrip, significantly reducing latency and improving throughput.
- **[OpenTelemetry](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#opentelemetry)** – Integrated tracing support for enhanced observability and easier debugging in distributed environments.

## Supported Engine Versions

Valkey GLIDE is API-compatible with the following engine versions:

| Engine Type           |  6.2  |  7.0  |   7.1  |  7.2  |  8.0  |  8.1  |
|-----------------------|-------|-------|--------|-------|-------|-------|
| Valkey                |   -   |   -   |   -    |   V   |   V   |   V   |
| Redis                 |   V   |   V   |   V    |   V   |   -   |   -   |
