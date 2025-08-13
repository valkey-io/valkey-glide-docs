# valkey-glide-docs

## Overview

The home of great documentation for Valkey GLIDE.  

The documentation will
- have a developer's perspective
- take the best parts of the existing documentation, consolidated and upgraded to best-in-class content
- Deliver a superior onboarding experience
- deliver an effective sales pitch indicating why GLIDE is the best choice in its class

## Technology

The site is built from markdown source and static HTML is generated using Markdoc 

Install [markdoc](https://markdoc.dev/docs/getting-started)

Install [pnpm](https://pnpm.io/installation)

## Building the site

Once you have installed Markdoc, open the terminal, change into this directory (if you are not here already) and execute the following

`pnpm build`

Upon executing, the source markup in the `content` folder will be converted from markdown to html and copied into the `dist` folder.

## Viewing the site

Open the `dist` folder and load the `index.html` file in your browser
