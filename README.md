[Link](https://duncan020313.github.io/blog)

This project uses a local custom theme in `layouts/` and `assets/`.
No external Hugo theme dependency is required.

## Local development

### Prerequisites
- **Hugo (extended)**: `hugo version`

### Run locally
```bash
hugo server -D --baseURL http://localhost:1313/ --appendPort=false
```

Open `http://localhost:1313/`.

## Build
```bash
hugo --minify
```

Output is generated in `public/`.
