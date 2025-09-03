# Commit Signoff Requirement

All commits must include the `--signoff` flag to add a "Signed-off-by" line.

**Required Command Pattern**:

```bash
git commit --signoff -m "Your commit message"
```

**Guidelines**:

- Always use the `--signoff` or `-s` flag when making commits
- The signoff indicates that you certify the commit under the Developer Certificate of Origin (DCO)
- This adds a "Signed-off-by: Your Name <your.email@example.com>" line to the commit message
- Required for all commits in this project

**Examples**:

```bash
git commit --signoff -m "Add new feature for user authentication"
git commit -s -m "Fix navigation bug in mobile view"
```

**Note**: If you forget to signoff a commit, you can amend it with:

```bash
git commit --amend --signoff
```
