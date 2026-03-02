# Project Structure And Rules Template

Use this as a baseline for projects like this one (Eleventy + Tailwind + TypeScript).

## 1) Folder Structure

```txt
/
  src/
    _includes/
      components/        # Reusable UI blocks
      layouts/           # Page shells (base layout, etc.)
    assets/
      css/
        input.css        # Tailwind input + base layer
        styles.css       # Generated CSS (do not edit manually)
      ts/                # TypeScript source files
      js/                # Generated JS from TS (do not edit manually)
      images/            # Static images
    index.html           # Homepage
    *.html               # Other pages
  _site/                 # Build output (generated, do not edit)
  eleventy.config.js     # Eleventy config
  tsconfig.json          # TypeScript config
  package.json           # Scripts + dependencies
```

## 2) Build Outputs And Editing Rules

- Edit only source files in `src/` and config files in repo root.
- Never hand-edit generated files:
- `src/assets/css/styles.css`
- `src/assets/js/*`
- `_site/*`
- Always run `npm run build` before finalizing changes.

## 3) Dependencies (Dev)

```json
{
  "@11ty/eleventy": "^3.x",
  "@tailwindcss/cli": "^4.x",
  "tailwindcss": "^4.x",
  "typescript": "^5.x",
  "npm-run-all": "^4.x",
  "rimraf": "^6.x",
  "prettier": "^3.x",
  "prettier-plugin-tailwindcss": "^0.7.x"
}
```

## 4) Required Scripts

```json
{
  "scripts": {
    "build": "run-s clean build:css build:ts build:site",
    "build:css": "tailwindcss -i ./src/assets/css/input.css -o ./src/assets/css/styles.css --minify",
    "build:ts": "tsc --project tsconfig.json",
    "build:site": "eleventy",
    "clean": "rimraf _site src/assets/css/styles.css src/assets/js",
    "dev": "run-p watch:css watch:ts serve",
    "serve": "eleventy --serve",
    "watch:css": "tailwindcss -i ./src/assets/css/input.css -o ./src/assets/css/styles.css --watch",
    "watch:ts": "tsc --project tsconfig.json --watch --preserveWatchOutput",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

## 5) Config Rules

### `eleventy.config.js`

- Input dir: `src`
- Output dir: `_site`
- Template engine: `njk`
- Passthrough copies required:
- `src/assets/css/styles.css -> assets/css/styles.css`
- `src/assets/js -> assets/js`
- `src/assets/images -> assets/images`

### `tsconfig.json`

- `rootDir`: `src/assets/ts`
- `outDir`: `src/assets/js`
- `target/module`: `ES2022`
- `moduleResolution`: `Bundler`
- `strict`: `true`
- `noEmitOnError`: `true`

## 6) Component And Page Rules

- New shared UI blocks go to `src/_includes/components/`.
- New layouts go to `src/_includes/layouts/`.
- Pages should use front matter and layout references.
- Keep markup mobile-first.
- Keep IDs stable for section links (example: `#services`, `#contact`).

## 7) CSS Rules

- Define design tokens in `@theme` inside `src/assets/css/input.css`.
- Put global resets and base styles in `@layer base`.
- Prefer utility classes in templates over custom one-off CSS.
- Keep horizontal overflow blocked for mobile safety.

## 8) Quality Gate (Before Merge)

- `npm run format:check` passes
- `npm run build` passes
- Test viewport widths: `320`, `360`, `375`, `768`, `1024+`
- Confirm no horizontal scroll on key pages
- Confirm links, buttons, and contact paths work

## 9) New Project Setup Checklist

- Copy this structure
- Install dependencies
- Add scripts
- Configure Eleventy and TS exactly
- Create base layout + homepage
- Create initial sections/components
- Run `npm run build`
- Start dev with `npm run dev`
