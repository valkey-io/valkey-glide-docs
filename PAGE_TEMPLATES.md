# Page Templates

## How-To Page (`how-to/`)

Purpose: A practical recipe. The reader wants to accomplish a task and needs to know what to copy, configure, and watch out for. Answers "how do I use this?"

```mdx
---
title: [Task Name]
description: [One-line description of what the reader will accomplish]
---

[Brief intro: what this feature does in 1-2 sentences]

## Usage

[Code examples for all supported languages]

## When to use [feature]

[Short guidance on when this is the right tool for the job, and when it isn't]

## Configuration options

[Table of options with defaults and descriptions]

## Supported commands

[List of commands that work with this feature]

## Incompatible commands

[List of commands that don't work, with brief note on behavior (error, silent failure, etc.)]

## Learn more

[Link to the corresponding concepts page for deeper understanding]
```

---

## Concepts Page (`concepts/`)

Purpose: An explanation. The reader wants to understand what's happening under the hood. Answers "how does this work and why?"

```mdx
---
title: [Feature Name]
description: [One-line description of what the reader will learn]
---

[Brief overview: what the feature does and why it exists (motivation)]

[Link to the how-to page for setup instructions]

## How it works

[Mechanism explanation: what happens at each step, where it runs, what the moving parts are]

## Compatibility

[Explanation of why certain operations are or aren't compatible, not just the list but the reasoning]
```
