# Angular builders

This repo contains some builders for Angular (v7).

## Install

```bash
npm install -D @tom-odb/angular-builders
```

or

```bash
yarn add @tom-odb/angular-builders
```

## @tom-odb/angular-builder:named-exports

This builder generates named exports for the build target using the [`@tom-odb/named-exports`](https://github.com/tom-odb/named-exports) package.

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
                "builder": "@tom-odb/angular-builders:named-exports",
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

For available options, see [`@tom-odb/named-exports`](https://github.com/tom-odb/named-exports#options).

## @tom-odb/angular-builder:generate-schemas

This builder generates validator classes for all models (*.model.ts) in the build target.

The provided models are mapped to json schemas using [`ts-json-schema-generator`](https://github.com/vega/ts-json-schema-generator) and validated using [`ajv`](https://github.com/epoberezkin/ajv).

Some restrictions:

* models have to be located in a `types` folder
* models have to have the `.model.ts` extension
* schemas will be generated to the `schemas` folder, next to the original `types` folder (if the folder does not exist it will be created)

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
            "generate-schemas": {
                "builder": "@tom-odb/angular-builders:generate-schemas",
                "options": {
                    "dir": "src",
                    "indent": "space",
                    "indentSize": 4,
                    "tsconfig": "path/to/tsconfig.json"
                }
            }
        }
    }
}
```

The result will be a validator class with the following structure:

```typescript
class DemoSchema {
    // a json schema based on the provided type
    public schema: {...};

    // a validate method that will validate the provided data against the json schema using AJV
    public validate(data) {...}

    // a toJSON method that will map the provided data to a clean JSON format
    public toJSON() {...}
}
```

## Contributing (Issue/PR)
Make sure to add your issue, question or feature request to the issue tracker and fire away!

## MIT LICENSE
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
