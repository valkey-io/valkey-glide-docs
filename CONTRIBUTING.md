# Contributing to Valkey GLIDE Documentation

Thank you for your interest in contributing to the [Valkey GLIDE documentation](https://glide.valkey.io)!

This guide gets you started on contributing to the documentation.
For the full technical instructions see our [Developer Instructions](/DEVELOPER.md).

> **Note:** This repository is for the documentation site only. To contribute to the Valkey GLIDE client library itself, visit the [valkey-glide repository](https://github.com/valkey-io/valkey-glide/).

## Requirements

Before continuing, make sure to follow the prerequisite instructions in our [Developer Instructions](/DEVELOPER.md).

## Language Agnostic Documentation

The goal of Valkey GLIDE documentation is to be the single source of truth for the various Valkey GLIDE clients.

When writing a documentation page, please consider writing for all client languages. In practice, this is easier than it sounds. Because clients share the same Rust core, they behave similarly and can share documentation, with language-specific code examples included when appropriate.

## Documenting a New Feature

When documenting a new feature, we recommend starting with a how-to guide. They are often simpler to write and provide immediate value to the users.

How-to guides are instructions on how to complete a certain tasks. It can include some conceptual explanation, but should stay focused on the "how" as lengthy explanations can be a distraction. If deeper understanding is needed, you should create separate articles in other sections.

## Adding Your Contents

Now that you have some content in mind, making changes to the docs is straightforward.

Content lives under `src/content/docs/` as `.mdx` files. If you are:

- **Editing an existing page:** Modify the corresponding `.mdx` file.
- **Adding a new page:** Create a new `.mdx` file under `src/content/docs/`. Every file requires frontmatter:

  ```mdx
  ---
  title: Your page title
  ---

  Your content follows...
  ```

- **Update the sidebar navigation:** Add your new page to `astro.config.mjs`.


## Making a Pull Request

1. **Run the pre-PR checks:**

   ```bash
   pnpm build
   pnpm format
   ```

   Commit any formatting changes before pushing.

2. **Sign off every commit** to certify the [DCO](https://developercertificate.org/):

   ```bash
   git commit --signoff -m "Your message"
   ```

   Or enable it automatically: `git config format.signOff true`.

   The DCO check is **case-sensitive** on name and email — verify with `git log -1 --format='%an <%ae>'`.

3. **Publish your branch:** Publish your changes and open a PR. 

   Make sure to link your PR to a related issue either in this repo or one of the Valkey GLIDE client repositories.
