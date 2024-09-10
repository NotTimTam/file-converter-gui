# file-converter-gui

Self-hostable GUI interface for [@nottimtam/file-converter](https://www.npmjs.com/package/@nottimtam/file-converter).

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
CLEAR_JOB_ON_DOWNLOAD=true
FILE_TEMP=./temp
FILE_SIZE_LIMIT=1000000000
DANGEROUSLY_FORCE_CLEAR_TEMP=false
```

### Breakdown

-   NODE_ENV
    -   "production" / "development"
-   API_VERSION
    -   "1" (the only current API version)
-   PORT
    -   The port you want the server to listen on.
-   [CLEAR_JOB_ON_DOWNLOAD](https://github.com/NotTimTam/file-converter?tab=readme-ov-file#parameters)
    -   "true" / "false"
-   [FILE_TEMP](https://github.com/NotTimTam/file-converter?tab=readme-ov-file#parameters)
    -   The directory to store files in during the conversion process.
-   [FILE_SIZE_LIMIT](https://github.com/NotTimTam/file-converter?tab=readme-ov-file#parameters)
    -   An optional maximum upload size in bytes.
-   [DANGEROUSLY_FORCE_CLEAR_TEMP](https://github.com/NotTimTam/file-converter?tab=readme-ov-file#parameters)
    -   "true" / "false" **_(serious consequences for parameter misuse, do not include parameter in `.env` unless absolutely necessary)_**
