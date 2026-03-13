# Implementation Plan: C# Client Documentation

## Overview

Add comprehensive C# client documentation to the Valkey GLIDE documentation website. This involves creating 14 new MDX files under `src/content/docs/languages/csharp/`, adding C# tabs to 7 cross-language pages, updating 2 config/commons files, and verifying correctness. All code examples must reflect the actual `valkey-glide-csharp` public API. The Go docs serve as the primary template.

## Tasks

- [-] 1. Foundation: Update configuration and commons files
  - [ ] 1.1 Add C# API reference entry to `astro.config.mjs` sidebar configuration
    - Add a C# entry under "Reference > API References" section, linking to the `valkey-glide-csharp` GitHub repository
    - Follow the same pattern as Go, Java, Python, Node.js entries (label, link, attrs with italic style and target \_blank)
    - _Requirements: 8.2, 8.3_
  - [ ] 1.2 Remove "coming soon" badge from C# button in `commons/supported-languages-buttons.mdx`
    - Remove the `<Badge text="coming soon!">` element from the C# button
    - Ensure the C# button links to the C# quickstart or getting-started page, consistent with other language buttons
    - _Requirements: 9.1, 9.2_

- [ ] 2. C# Landing Page
  - [ ] 2.1 Replace the placeholder `src/content/docs/languages/csharp/index.mdx` with full landing page content
    - Remove the "Coming Soon" caution aside and draft/badge frontmatter
    - Add introductory description of Valkey GLIDE for C#, system requirements, supported .NET versions
    - Import and display the shared `SupportedEngineVersions` component from `commons/supported-engine-versions.mdx`
    - Follow the Go `index.mdx` landing page as the template
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Getting Started Pages
  - [ ] 3.1 Create `src/content/docs/languages/csharp/getting-started/getting-started.mdx`
    - Cover system requirements, installation via NuGet (`dotnet add package Valkey.Glide`), and project setup
    - Include code examples for creating both `GlideClient` (standalone) and `GlideClusterClient` (cluster) connections
    - Include a basic ping example demonstrating a successful connection
    - Follow the Go `getting-started.mdx` as the template
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ] 3.2 Create `src/content/docs/languages/csharp/getting-started/first-app.mdx`
    - Walk through building a complete sample application using the C# client
    - Use `async/await` patterns, proper `using` statements, and correct class/method names from the actual API
    - Follow the Go `first-app.mdx` as the template
    - _Requirements: 2.4, 11.1, 11.2, 11.4_

- [ ] 4. Checkpoint - Verify foundation and getting started
  - Ensure `pnpm build` passes with the new and modified files so far, ask the user if questions arise.

- [ ] 5. How-To Guides (Language-Specific)
  - [ ] 5.1 Create `src/content/docs/languages/csharp/how-to/Client-Initialization.mdx`
    - Cover standalone and cluster client setup with C#-specific configuration details
    - Show `GlideClientConfiguration` and `GlideClusterClientConfiguration` usage
    - Follow the Go `Client-Initialization.mdx` as the template
    - _Requirements: 4.1, 4.6_
  - [ ] 5.2 Create `src/content/docs/languages/csharp/how-to/Authentication.mdx`
    - Cover password-based and ACL authentication using `ServerCredentials`
    - Follow the Go `Authentication.mdx` as the template
    - _Requirements: 4.2, 4.6_
  - [ ] 5.3 Create `src/content/docs/languages/csharp/how-to/TLS.mdx`
    - Cover TLS/SSL connection configuration using `UseTls` property
    - Follow the Go `TLS.mdx` as the template
    - _Requirements: 4.3, 4.6_
  - [ ] 5.4 Create `src/content/docs/languages/csharp/how-to/Timeouts-and-Reconnect-Strategy.mdx`
    - Cover timeout configuration (`RequestTimeout`) and reconnection behavior (`ReconnectStrategy`, `BackoffStrategy`)
    - Follow the Go `Timeouts-and-Reconnect-Strategy.mdx` as the template
    - _Requirements: 4.4, 4.6_
  - [ ] 5.5 Create `src/content/docs/languages/csharp/how-to/Read-Strategy.mdx`
    - Cover read-from-replica configuration using `ReadFrom` enum
    - Follow the Go `Read-Strategy.mdx` as the template
    - _Requirements: 4.5, 4.6_

- [ ] 6. Valkey Commands Pages
  - [ ] 6.1 Create `src/content/docs/languages/csharp/valkey-commands/index.mdx`
    - Describe the C# command API patterns and link to source code documentation
    - Follow the Go `valkey-commands/index.mdx` as the template
    - _Requirements: 5.1_
  - [ ] 6.2 Create `src/content/docs/languages/csharp/valkey-commands/batch-transaction-and-pipelining.mdx`
    - Cover batch operations and transaction support in the C# client
    - Follow the Go `batch-transaction-and-pipelining.mdx` as the template
    - _Requirements: 5.2_

- [ ] 7. Reference Pages
  - [ ] 7.1 Create `src/content/docs/languages/csharp/reference/api-reference.mdx`
    - Link to the C# client's API documentation or source code on GitHub
    - Follow the Go `api-reference.mdx` as the template
    - _Requirements: 6.1_
  - [ ] 7.2 Create `src/content/docs/languages/csharp/reference/configuration.mdx`
    - Document available configuration options for `GlideClientConfiguration` and `GlideClusterClientConfiguration`
    - Include properties: `Addresses`, `UseTls`, `RequestTimeout`, `Credentials`, `DatabaseId`, `ClientName`, `ReadFrom`, `ReconnectStrategy`
    - Follow the Go `configuration.mdx` as the template
    - _Requirements: 6.2_

- [ ] 8. Developer Pages
  - [ ] 8.1 Create `src/content/docs/languages/csharp/developer/index.mdx`
    - Serve as the entry point for C# client contributor documentation
    - Follow the Go `developer/index.mdx` as the template
    - _Requirements: 7.1_
  - [ ] 8.2 Create `src/content/docs/languages/csharp/developer/Build-from-source.mdx`
    - Cover how to clone, build, and set up the C# client development environment
    - Follow the Go `Build-from-source.mdx` as the template
    - _Requirements: 7.2_
  - [ ] 8.3 Create `src/content/docs/languages/csharp/developer/Community-and-Feedback.mdx`
    - Include links to the GitHub repository, issue tracker, and contribution guidelines
    - Follow the Go `Community-and-Feedback.mdx` as the template
    - _Requirements: 7.3_

- [ ] 9. Checkpoint - Verify all language-specific pages
  - Ensure `pnpm build` passes with all 14 new C# MDX files, ask the user if questions arise.

- [ ] 10. Cross-Language Page Integration: Getting Started
  - [ ] 10.1 Add C# tab to `src/content/docs/getting-started/quickstart.mdx`
    - Add `<TabItem label="C#">` sections covering NuGet installation, ping example, and connection configuration
    - Place C# tab consistently with existing language tab ordering
    - Use correct `Valkey.Glide` namespace, `async/await` patterns, and actual API class names
    - _Requirements: 3.1, 3.2, 11.1, 11.2, 11.4_
  - [ ] 10.2 Add C# tab to `src/content/docs/getting-started/basic-operations.mdx`
    - Add `<TabItem label="C#">` sections covering SET, GET, MSET, MGET, and DEL operations
    - Use correct method names from the C# client API (e.g., `SetAsync`, `GetAsync`)
    - _Requirements: 3.1, 3.3, 11.1, 11.2, 11.4_

- [ ] 11. Cross-Language Page Integration: How-To Guides
  - [ ] 11.1 Add C# tab to `src/content/docs/how-to/installation.mdx`
    - Add `<TabItem label="C#">` with NuGet package installation instructions
    - _Requirements: 3.1, 3.4, 11.1, 11.4_
  - [ ] 11.2 Add C# tab to `src/content/docs/how-to/client-initialization.mdx`
    - Add `<TabItem label="C#">` covering both standalone and cluster client creation
    - Show `GlideClientConfiguration` and `GlideClusterClientConfiguration` usage
    - _Requirements: 3.1, 3.5, 11.1, 11.2, 11.4_
  - [ ] 11.3 Add C# tab to `src/content/docs/how-to/publish-and-subscribe-messages.mdx` (if supported)
    - Check if the C# client supports pub/sub functionality
    - If supported, add `<TabItem label="C#">` with pub/sub examples; if not, omit the tab
    - _Requirements: 10.2, 10.4_
  - [ ] 11.4 Add C# tab to `src/content/docs/how-to/send-batch-commands.mdx` (if supported)
    - Check if the C# client supports batch/pipeline operations
    - If supported, add `<TabItem label="C#">` with batch command examples; if not, omit the tab
    - _Requirements: 10.3, 10.4_

- [ ] 12. Cross-Language Page Integration: Reference
  - [ ] 12.1 Add C# tab to `src/content/docs/reference/connection-options.mdx`
    - Add C# row to the connection options table
    - Add `<TabItem label="C#">` with configuration examples and link to C# API reference
    - _Requirements: 3.1, 3.6, 11.1, 11.4_

- [ ] 13. Checkpoint - Verify cross-language integration
  - Ensure `pnpm build` passes with all cross-language tab additions, ask the user if questions arise.

- [ ] 14. Property-based and unit tests
  - [ ]\* 14.1 Write property test for cross-language C# tab inclusion correctness
    - **Property 1: Cross-language C# tab inclusion correctness**
    - For any cross-language page with tabbed code examples, verify C# tab presence/absence matches client feature support
    - Use `fast-check` to generate random selections from the set of cross-language pages
    - **Validates: Requirements 3.1, 10.4**
  - [ ]\* 14.2 Write property test for C# code example API correctness
    - **Property 2: C# code example API correctness**
    - For any C# code block across all docs pages, verify it uses `Valkey.Glide` namespace, `async/await` patterns, and correct class/method names
    - Use `fast-check` to generate random selections from MDX files containing C# code blocks
    - **Validates: Requirements 4.6, 11.1, 11.2, 11.4**
  - [ ]\* 14.3 Write property test for C# directory structure completeness
    - **Property 3: C# directory structure completeness**
    - For any fully-documented language, verify the C# directory contains the same required subdirectories (`getting-started/`, `how-to/`, `valkey-commands/`, `reference/`, `developer/`) each with at least one MDX file
    - Use `fast-check` to generate random selections from documented languages
    - **Validates: Requirements 8.1**
  - [ ]\* 14.4 Write unit tests for file existence and content verification
    - Verify all 14 new C# MDX files exist at their specified paths
    - Verify "Coming Soon" caution aside is removed from `index.mdx`
    - Verify "coming soon" badge is removed from `supported-languages-buttons.mdx`
    - Verify `astro.config.mjs` contains C# API reference entry
    - _Requirements: 1.4, 8.2, 9.1_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Run `pnpm build` and `pnpm format` to verify everything compiles and is formatted correctly, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation via `pnpm build`
- The Go docs (`src/content/docs/languages/go/`) serve as the primary template for all new pages
- All C# code examples must use the actual `valkey-glide-csharp` public API (namespace `Valkey.Glide`, classes `GlideClient`, `GlideClusterClient`, etc.)
- Cross-language tabs for pub/sub and batch commands are conditional on C# client support (Requirement 10.4)
