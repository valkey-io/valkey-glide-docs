# Project: Valkey GLIDE Documentation

## Project Overview

This project is the official documentation for Valkey GLIDE, a client library for the Valkey in-memory database. The documentation is built using the [Starlight](https://starlight.astro.build/) framework, which is based on [Astro](https://astro.build/).

The documentation is structured to provide a comprehensive guide for developers using Valkey GLIDE with different programming languages. It includes tutorials, how-to guides, conceptual explanations, and API references.

The main technologies used in this project are:
-   **Astro/Starlight:** For building the static documentation website.
-   **MDX:** For writing the content of the documentation pages.
-   **pnpm:** For package management.

## Building and Running

The project uses `pnpm` for dependency management and running scripts.

-   **Install dependencies:**
    ```bash
    pnpm install
    ```

-   **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start a hot-reloading development server at `http://localhost:4321`.

-   **Build the project:**
    ```bash
    pnpm build
    ```
    This will create a static build of the website in the `dist/` directory.

-   **Preview the build:**
    ```bash
    pnpm preview
    ```
    This will serve the built site for previewing before deployment.

## Development Conventions

-   **Content:** All documentation content is located in the `src/content/docs` directory. The content is written in MDX.
-   **Structure:** The sidebar navigation and overall structure of the documentation are defined in the `astro.config.mjs` file.
-   **Code Examples:** Code examples for different languages are provided using Starlight's `Tabs` and `TabItem` components. This allows users to easily switch between language-specific examples.
-   **Styling:** Custom styling is applied through the `src/styles/custom.css` file.
-   **Formatting:** The project uses `prettier` for code formatting and `remark` for linting Markdown files. You can format the code using the following command:
    ```bash
    pnpm format
    ```
