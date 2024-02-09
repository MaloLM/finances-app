# FINANCES Technical Documentation

## Overview of the Application Architecture & Configuration

The FINANCES app leverages the Electron framework, which allows for a separation of concerns between the backend logic ('main' process) and the rendering logic ('renderer' process).

### Codebase Structure

-   `src`: The source directory containing all the application code.
    -   `data`: Stores data files used by the application, such as `tam_form_data.json`, which could contain form data for the Target Allocation Maintenance feature.
    -   `main`: Contains the backend logic of the Electron app.
        -   `main.js`: The entry point for the Electron main process.
        -   `preload.js`: Script that can safely run before the renderer process is loaded.
        -   `services`: Contains backend services.
    -   `renderer`: Contains the rendering logic for the Electron app.
        -   `App.tsx`: The main React component that wraps the entire renderer process UI.
        -   `api`: Contains API-related code, possibly for communicating between the renderer and main processes.
        -   `assets`: Static assets like images, logos, etc.
        -   `components`: Reusable React components.
        -   `context`: React Contexts for state management across the application.
        -   `pages`: React components that represent entire pages or routes in the application.
        -   `styles`: Contains global CSS files for styling the application.
        -   `utils`: Utility functions and types for the application.

### Configuration Files

The application is configured using several files:

-   `package.json`: Lists all the dependencies and scripts needed for the project.
-   `package-lock.json`: Provides version information for all packages installed which ensures that the same version of a package is used on all environments.
-   `tsconfig.main.json` and `tsconfig.renderer.json`: Configuration files for TypeScript compilation in the main and renderer processes respectively.
-   `webpack.main.config.js` and `webpack.renderer.config.js`: Define the configuration for Webpack to bundle the main and renderer process code.
-   `.gitignore`: Specifies intentionally untracked files to ignore by Git.
-   `.prettierrc`: Configuration for Prettier, an opinionated code formatter, ensuring code style consistency.
-   `postcss.config.js`: Configuration for PostCSS, a tool for transforming CSS with JavaScript plugins.
-   `tailwind.config.js`: Configuration for TailwindCSS, a utility-first CSS framework.
-   `public/index.html`: The main HTML file that serves as the entry point to the renderer process.

## Setup Development Mode

To optimize the development environment for efficiency, such as enabling hot reload, certain modifications are necessary:

-   In `main.js`:

    -   Disable `contextIsolation` and remove `preload` in `new BrowserWindow` parameters:

        ```jsx
        contextIsolation: false
        // preload: path.join(__dirname, 'preload.bundle.js')
        ```

    -   Load from localhost during development instead of the `index.html` file:

        ```jsx
        // win.loadFile("index.html");
        win.loadURL('http://localhost:8080')
        ```

    -   Optionally, open the developer tools by default:

        ```jsx
        win.webContents.openDevTools()
        ```

-   In `dataFiles.js`:

    -   Modify the data file path for development:

        ```jsx
        function getDataFilePath(filename) {
            // return path.join(__dirname, filename); // Final build path
            return path.join(__dirname, '..', '..', 'data', filename) // Development path
        }
        ```

    This adjustment accounts for the different file paths encountered during the build process versus development.

-   In `renderer/api/electron.tsx`:

    If `preload` and `contextIsolation` were previously set, the `ipcRenderer` cannot be used directly. It is necessary to call functions defined in `preload.js`:

    -   Original code using `ipcRenderer` directly:

        ```jsx
        import { ipcRenderer } from 'electron'

        export function useIpcRenderer() {
            const sendRequestData = () => {
                ipcRenderer.send('request-data-channel')
            }
            ....
        }
        ```

    -   Modified code calling functions from `preload.js`:

        ```jsx
        export function useIpcRenderer() {
            const sendRequestData = () => {
                window.electron.requestData()
            }
            ....
        }
        ```

Make sure to revert these changes when preparing the application for production to ensure security and proper file path resolution.

## Dependencies and Libraries

The app is built using a variety of dependencies listed in the project's `package.json` file. Here is the list of key dependencies and development dependencies:

-   **Main Dependencies**:

    -   `chart.js`: Charting library used for visualizations like the pie and bar charts.
    -   `formik`: Library to manage form state in React.
    -   `fs`: Filesystem module to interact with the file system.
    -   `lucide-react`: React icons library.
    -   `path`: Utility module to handle file paths.
    -   `react-chartjs-2`: React wrapper for `chart.js`.
    -   `react-hot-toast`: Library for creating toast notifications.
    -   `react-router-dom`: DOM bindings for React Router.
    -   `yup`: Schema builder for value parsing and validation.

-   **Development Dependencies**:

    -   Babel and TypeScript-related packages for compiling JavaScript and TypeScript.
    -   Electron and Webpack for bundling and running the Electron application.
    -   TailwindCSS and PostCSS for styling.
    -   Various loaders and plugins for handling different file types in the Webpack build process.

    Here are the additional sections formatted for inclusion in the `TECHNICAL-README.md` file:

## Security

For security within the Electron framework, the following practices are generally recommended and should be implemented:

-   Use of `contextIsolation` in the Electron renderer process to ensure that preload scripts run in a separate context from the page.
-   Enable `nodeIntegration` and `enableRemoteModule` only if absolutely necessary and understand the security implications of doing so.
-   Sanitize any data that is being sent from and to the renderer process to prevent code injection attacks.

For more details on Electron's security recommendations, it is advised to refer to the official Electron security documentation.

## External Resources

For developers looking to enhance their understanding or streamline their workflow, the following resources may prove invaluable:

-   Useful GPTs
    -   React + Electron: [GPT React-Electron Guide](https://chat.openai.com/g/g-JlFTNuY6S-react-electron)
    -   Tailwind CSS: [GPT Tailwind CSS Guide](https://chat.openai.com/g/g-SjAqAvLPM-tailwind-css-copilot)
-   Icons
    -   Lucide Icons: [Lucide Icon Library](https://lucide.dev/icons/)
-   Tailwind UI Components
    -   Flowbite: [Flowbite Tailwind UI](https://flowbite.com/docs/getting-started/introduction/)
-   Tailwind Cheat Sheet
    -   Tailwind Components: [Tailwind CSS Cheatsheet](https://tailwindcomponents.com/cheatsheet/)

## New Feature Workflow

To add a new feature to the FINANCES app, follow these steps which cover changes across both the main and renderer processes:

### Main Process

1. **Function Implementation**: Implement the necessary functions within the `main` logic. This includes creating new service functions that the feature will require to operate.
2. **Preload Endpoints**: If using a `preload.js` file, define a new endpoint that the renderer process will use to access the new functions in the main process.

### Renderer Process

1. **API Endpoint**: Add the new endpoint function within the `renderer/api/electron.js` file. This should mirror the structure of existing endpoints to maintain consistency.
2. **Function Declaration**: Declare the function signature in the `src/type.d.ts` file to provide TypeScript definitions, which will prevent IDE errors related to undefined functions.
3. **Feature Page**: Create a new page component in the `renderer/pages` directory that will serve as the interface for your new feature. Utilize the newly created API function within this component.
4. **Routing**: Integrate the new page into the application's routing by adding an entry in the `renderer/App.tsx` file. Assign it a route path that reflects the feature name (e.g., `/feature-name`).
5. **Sidebar Link**: Add a new link in the `renderer/components/Sidebar.tsx` for easy navigation to your feature. Ensure consistency with existing links and utilize an appropriate icon from the Lucide Icon Library. Icons can be searched and selected from the [Lucide Icon Library](https://lucide.dev/icons/).
6. **Feature Development**: Develop the feature using existing UI components like `Card`, `Button`, and form `Fields` to ensure a consistent look and feel. For design patterns and component examples, you can reference the [FlowBite Library](https://flowbite.com/docs/getting-started/introduction/). Note that it's not necessary to install FlowBite; it's merely for visual and functional reference.
