# Pre-PR Checks

Before creating a pull request, always run these commands to ensure code quality and prevent CI failures.

## Required Commands

Run these commands in order before creating any PR:

```bash
pnpm build
pnpm format
```

## Guidelines

- **Build Check**: `pnpm build` ensures the project compiles without errors
- **Format Check**: `pnpm format` applies consistent code formatting across the codebase
- **Run Order**: Always run build first, then format
- **Fix Issues**: Address any errors or warnings before proceeding with PR creation
- **Commit Changes**: If formatting changes files, commit those changes before pushing

## Workflow Integration

1. Make your code changes
2. Run `pnpm build` to verify compilation
3. Run `pnpm format` to ensure consistent formatting
4. Commit any formatting changes with signoff
5. Push branch and create PR

## Why This Matters

- Prevents CI build failures
- Maintains consistent code style
- Catches compilation errors early
- Reduces review overhead
- Ensures professional code quality

## Example Workflow

```bash
# After making changes
git add .
git commit --signoff -m "Add new feature"

# Pre-PR checks
pnpm build
pnpm format

# Commit any formatting changes
git add .
git commit --signoff -m "Apply code formatting"

# Push and create PR
git push origin your-branch-name
```
