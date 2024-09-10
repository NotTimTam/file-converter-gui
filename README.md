# file-converter-gui

Self-hostable GUI interface for (@nottimtam/file-converter)[https://www.npmjs.com/package/@nottimtam/file-converter].

See [file-converter](https://github.com/NotTimTam/file-converter) for general implementation instructions and API reference.

## Installation

```terminal
npm i @nottimtam/file-converter-gui
```

## Spinup

```terminal
npm start
```

## Environment Variables

For the application to run properly, certain environment variables need to be defined.

### Example

```env
NODE_ENV=development
API_VERSION=1
PORT=3000
```

### Breakdown

-   NODE_ENV
    -   "production" / "development"
-   API_VERSION
    -   "1" (the only current API version)
-   PORT
    -   The port you want the server to listen on.
