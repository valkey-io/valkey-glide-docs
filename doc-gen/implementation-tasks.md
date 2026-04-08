# Tasks: Auto-generate Python API Docs with MkDocs

Migrate from manual stub files to auto-generated docs using mkdocs-gen-files + mkdocs-literate-nav + mkdocs-section-index. Tested prototype in `doc-gen/mkdocs-test/`.

## Tasks

### 1. Copy generation script
- Copy `doc-gen/mkdocs-test/gen_ref_pages.py` to `doc-gen/gen_ref_pages.py`
- Verify the `root` path resolution works relative to the new location

### 2. Update `doc-gen/requirements.txt`
- Replace contents with:
  ```
  mkdocs
  mkdocstrings-python>=1.18.2, <2.0.0
  pymdown-extensions
  mkdocs-material
  mkdocs-gen-files
  mkdocs-literate-nav
  mkdocs-section-index
  ```
- Remove `mkdocs-breadcrumbs-plugin` (no longer needed)

### 3. Update `doc-gen/mkdocs.yml`
- Remove the entire hardcoded `nav` section
- Add `nav` with just: `- API Reference: reference/`
- Add plugins: `gen-files`, `literate-nav`, `section-index`
- Point `gen-files` script to `gen_ref_pages.py`
- Add mkdocstrings options: `docstring_style: google`, `members_order: source`, `filters: ["!^_"]`
- Remove `mkdocs-breadcrumbs-plugin` from plugins
- Keep: theme, markdown_extensions, extra_css, site_name, site_url, repo_url

### 4. Delete old stub files
- Remove `doc-gen/mkdocs/glide_async/` (entire directory)
- Remove `doc-gen/mkdocs/glide_sync/` (entire directory)
- Remove `doc-gen/mkdocs/glide_shared/` (entire directory)
- Remove `doc-gen/mkdocs/lua-scripts-guide.md`
- Keep `doc-gen/mkdocs/index.md` and `doc-gen/mkdocs/style.css`

### 5. Clean up test artifacts
- Remove `doc-gen/mkdocs-test/` (prototype, no longer needed)
- Remove `doc-gen/mkdocs-test-output/`
- Remove `doc-gen/pdoc-test-output/`
- Remove `doc-gen/sphinx/`
- Remove `doc-gen/sphinx-output/`
- Remove `doc-gen/.pdoc-test/`
- Remove `doc-gen/auto-docgen-tasks.md`
- Remove `doc-gen/auto-docgen-proposal.md`
- Remove `doc-gen/pdoc-migration-tasks.md`
- Remove `doc-gen/port-upstream-mkdocs-tasks.md`
- Remove `doc-gen/sphinx-migration-proposal.md`
- Remove generated protobuf files in `doc-gen/valkey-glide/python/glide-shared/glide_shared/protobuf/`

### 6. Test the build
- Run `doc-gen/build-python-docs.sh`
- Verify:
  - Build succeeds
  - Output in `doc-gen/docs/python/`
  - All three packages documented (glide, glide_sync, glide_shared)
  - Sidebar navigation auto-generated and collapsed by default
  - No private/internal classes exposed (FFIClientTypeEnum, PubSubChannelModes, etc.)
  - Full-text search works
  - Material theme and custom styles preserved
  - `test-deploy.sh` works with new output
