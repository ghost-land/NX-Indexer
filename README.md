
# nx-indexer-3000

**nx-indexer-3000** is a versatile tool designed for indexing and managing game files across various platforms. It organizes and maintains a database for base games, updates, downloadable content (DLC), and retroarch forwarders, providing an efficient way to manage your game library.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [File Details](#file-details)
- [Dependencies](#dependencies)
- [License](#license)

## Features

- **Base Game Processing**: Indexes base games from designated directories.
- **Update Management**: Processes game updates and integrates them into the existing game database.
- **DLC Support**: Manages downloadable content (DLC) files effectively.
- **Retroarch Forwarders**: Supports retroarch forwarders for older consoles.
- **Automated Database Creation**: Automatically generates and updates a comprehensive game database.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ghost-land/NX-Indexer.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd NX-Indexer
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

### Environment Variables

Set up your environment variables in a `.env` file at the root of the project. Refer to the `.env.example` file for required configurations. Ensure all necessary paths and API keys are correctly configured.

### Directory Structure

Maintain the following directory structure for the application to function properly:

- `nsz/base`: Contains base game files.
- `nsz/updates`: Contains game update files.
- `nsz/dlc`: Contains DLC files.
- `forwarders`: Contains retroarch forwarder files.

Ensure these directories are correctly set up to allow the script to find and process files.

## Usage

To start the application, run the following command:

```bash
npm start
```

This command will execute the `index.js` script and begin processing the game files based on the directory structure.

Alternatively, you can use the provided `run.sh` script to start the process:

```bash
./run.sh
```

## Scripts

- **`start`**: Runs the main indexing script.
  ```bash
  npm start
  ```
- **`run.sh`**: Bash script that initiates the indexing process.

## File Details

- **`index.js`**: The main script responsible for indexing and processing game files.
- **`package.json` & `package-lock.json`**: Contains project dependencies and scripts for npm.
- **`run.sh`**: A shell script to execute the application.
- **`jsconfig.json`**: Configuration file for JavaScript and TypeScript settings.
- **`.gitignore`**: Lists files and directories that should not be tracked by Git.

## Dependencies

The project uses the following dependencies:

- Node.js (version 14.X or higher)
- Other dependencies are listed in `package.json`.

Ensure you have all dependencies installed before running the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.