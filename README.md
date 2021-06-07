# @studiohyperdrive/angular-builders

This repo contains some builders for Angular (v7+).

## Install

```bash
npm install -D @studiohyperdrive/angular-builders
```

or

```bash
yarn add @studiohyperdrive/angular-builders
```

## @studiohyperdrive/angular-builder:named-exports

This builder generates named exports for the build target using the [`@studiohyperdrive/named-exports`](https://github.com/studiohyperdrive/named-exports) package.

### Usage

Use the builder in your build targets:

```json
{
  ...
  "projects": {
    "demo": {
        ...
        "architect": {
            ...
            "named-exports": {
                "builder": "@studiohyperdrive/angular-builders:named-exports",
                "options": {
                    "dir": "src",
                    "indent": "space",
                    "indentSize": 4,
                    "ignore": "*.spec.ts"
                }
            }
        }
    }
}
```

For available options, see [`@studiohyperdrive/named-exports`](https://github.com/studiohyperdrive/named-exports#options).

## @studiohyperdrive/angular-builder:build-library

This builder runs the `ng build` command with support for auto-generated export files using the `named-exports` package described above.

### Usage

Use the builder in your build targets like you would the standard library builder, adding options for the `named-exports` builder under the `namedExports` property:

```json
{
  ...
  "projects": {
    "demo": {
        ...
        "architect": {
            ...
            "build": {
                "builder": "@studiohyperdrive/angular-builders:builder-library",
                "options": {
                    "tsConfig": "projects/demo/tsconfig.lib.json",
                    "project": "projects/demo/ng-package.json",
                    "namedExports": {
                        "dir": "projects/demo/src",
                        "fileName": "public-api"
                    }
                }
            }
        }
    }
}
```

For available options, see [`@studiohyperdrive/named-exports`](https://github.com/studiohyperdrive/named-exports#options).

## Contributing (Issue/PR)
Make sure to add your issue, question or feature request to the issue tracker and fire away!
