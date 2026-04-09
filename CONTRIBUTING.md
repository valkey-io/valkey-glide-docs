# Contributing to Valkey GLIDE Documentation

Thank you for your interest in contributing to the [Valkey GLIDE documentation](https://glide.valkey.io)!

This guide aims to help answer more conceptual questions about writing documentations like:
- What kind of documentation should I write?
- How should I write my documentations?

For more technical instructions, like how to set up the environment, see our [Readme](/README.md).

> **Note:** This repository is for the documentation site only. To contribute to the Valkey GLIDE client library itself, visit the [valkey-glide repository](https://github.com/valkey-io/valkey-glide/).

## Language Agnostic Documentation

The goal of Valkey GLIDE documentations is to be the single source of truth for the various Valkey GLIDE clients.

When writing documentations, it should be written in considerations for all client languages. In practice, this is easier than it sounds due to the Rust core design. Because clients share the same core we expects them to behave similarly; They naturally are able share the same documentation with language specific examples included when appropriate. Often these comes as code examples.

## Adding Documentation For A New Feature.

Users reach for the documentation because they want to know "how do I do x with GLIDE". Thus when documenting a new feature, we recommend starting with a how-to guides on using such feature. This is usually simple and quicker to write, and provide immediate benefits.

While your how-to guides should have some conceptual explanations, it should remain focused on answering the "how do I do x" question. Having a length explanation can often distract from this. If this is required, it is best to create a separate articles in our Learn sections with the focus on teaching the reader.

In general, a guide line for how-to articles would be:
- The title should start with a verb. Ex: Installing GLIDE, Making Batch Commands.
- The content is about showing the reader how to doing something. This often involves using code examples.
- Some conceptual explanation is encouraged, but it should not be the focus.
