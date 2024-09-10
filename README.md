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
```

### Breakdown

-   NODE_ENV
    -   "production" / "development"
-   API_VERSION
    -   "1" (the only current API version)
-   PORT
    -   The port you want the server to listen on.
-   [CLEAR_JOB_ON_DOWNLOAD](https://github.com/NotTimTam/file-converter#:~:text=they%20are%20converted.-,clearJobOnDownload,-%3A%20boolean%20%2D%20%28default)
    -   "true" / "false"
-   [TEMP](https://github.com/NotTimTam/file-converter#:~:text=request%2C%20in%20bytes.-,temp,-%3A%20string%20%2D%20An)
    -   The directory to store files in during the conversion process.
-   [FILE_SIZE_LIMIT](https://github.com/NotTimTam/file-converter#:~:text=the%20converter%27s%20functionality.-,fileSizeLimit,-%3A%20number%20%2D%20A)
    -   An optional maximum upload size in bytes.
-   [DANGEROUSLY_FORCE_CLEAR_TEMP](https://github.com/NotTimTam/file-converter#:~:text=DANGEROUSLYforceClearTemp)
    -   "true" / "false" **_(serious consequences for parameter misuse, do not include parameter in `.env` unless absolutely necessary)_**
