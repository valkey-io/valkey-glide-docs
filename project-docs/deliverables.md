## Description

This tracks the work required for the document enhancement project.
https://valkey.io/valkey-glide-docs/

## Deliverables

### Inital PoC (Done)
  - [x] Proposal

  - [x] Discovery
    - [x] Evaluate Documentation Frameworks.
    - [x] Evaluate Diátaxis
    - [x] Evaluate search capabilites
    - [x] Evaluate automation of updates (when adding new features)

  - [x] Pilot build
	- [x] Choose a location to host the site
    - [x] Choose a documentation framework: Chosen Starlight Astro 	
	- [x] Create an empty site with no content
	- [x] Project structure initialized.
	- [x] Migrated old contents from the repo and the wiki
    - [x] Intial site reviewed by stakeholders

### Docuementation Site Developement
  - [ ] Overall site features and styling
    - [ ] A fully styled site matching Valkey's brandings.
    - [ ] A reviewed and approved site homepage.
    - [ ] A complete site-wide navigation structure.
      - [ ] Finalized nav bar structures.
      - [ ] A site-wide language selector.
      - [ ] Configured breadcrumb navigation. 
      - [ ] A process for hiding unfinished pages from production builds.

  - [ ] Site infrastructure
    - [x] A configured code formatter.
    - [ ] A functional CI/CD pipeline for the documentation.
      - [ ] Separate domains for dev and prod sites.
      - [ ] Automated broken link checker.
    - [ ] A system for managing shared contents, ie: duplicated code examples.
    
  - [ ] Site Content
    - [ ] A home page
    - [ ] Reviewed "Getting Started" Section.
    - [ ] Reviewed "How-To Guides" Section.
    - [ ] Reviewed "Concepts" Section.
    - [ ] Reviewed "Reference" Section.
    - [ ] Reviewed "Migration" Section. 
      - [ ] A reviewed and approved index page.
    - [ ] Reviewed "Languages" Section.
      - [ ] Reviewed Go section.
      - [ ] Reviewed Java section.
      - [ ] Reviewed Python section.
      - [ ] Reviewed Node section.
      - [ ] A documented process for language-specific updates.
      - [ ] An automated doc gen system for API references.

### Site Optimization and Accessibility (Future).
 - [ ] SEO Optimized.

 - [ ] Site Analytics.

 - [ ] Translated contents support.

### Additional Notes

Reviewing a section will include:
- Deciding on materials needed.
- Consolidating pages.
- Creating new contents.
- Removing unessary pages.
- Updating outdated contents and examples.
- Reviewed and approved by stakeholders.

In general, we will try to follow the structure as described [here](https://github.com/valkey-io/valkey-glide-docs/blob/main/project-docs/structure.md) but new pages maybe added or removed 
to fit with the overall structure.