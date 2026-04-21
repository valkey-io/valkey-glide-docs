# Contributing to Valkey GLIDE Documentation

Thank you for your interest in contributing to the [Valkey GLIDE documentation](https://glide.valkey.io)!

This guide will cover both conceptual and technical questions about writing documentation:

- How to prepare the environment?
- How do I make a first contribution?
- What kind of documentation should I write?
- How should I write my documentation?

For more technical instructions, like how to set up the environment, see our [Readme](/README.md).

> **Note:** This repository is for the documentation site only. To contribute to the Valkey GLIDE client library itself, visit the [valkey-glide repository](https://github.com/valkey-io/valkey-glide/).

## Language Agnostic Documentation

The goal of Valkey GLIDE documentation is to be the single source of truth for the various Valkey GLIDE clients.

When writing documentation, consider all client languages. In practice, this is easier than it sounds. Because clients share the same Rust core, they behave similarly and can share documentation, with language-specific code examples included when appropriate.

## Adding Documentation For A New Feature

Users come to the documentation to learn how to do something with GLIDE. When documenting a new feature, we recommend starting with a how-to guide. These are simpler to write and provide immediate value.

How-to guides can include some conceptual explanation, but should stay focused on the "how". Lengthy explanations can be a distraction. If deeper context is needed, create a separate article in our Learn section instead.

Guidelines for how-to articles:

- The title should be an action (e.g., "Installing GLIDE", "Making Batch Commands").
- The content shows the reader how to do something, often with code examples.
- Some conceptual explanation is encouraged, but it should not be the focus.
