# mydbportal-cli

## Description:
mydbportal CLI is a  command-line tool that helps developers connect to and manage their databases on mydbportal.com

## Installation

```bash
bun install -g mydbportal-cli
```

## Usage

Follow these steps to use the `mydbportal-cli`:

### Step 1: Create account on mydbportal.com

### Step 2: Before you can use any other commands, you need to log in to your mydbportal cli.

```bash
mydb login
```

This command will open a browser window, prompting you to authenticate with your Google account. Once authenticated, you can close the browser tab.

### Step 3: List Your Databases

After logging in, you can list all your available databases:

```bash
mydb list
```

This will display a list of your databases. You can then select a database from the list to view more details.

### Step 4: Create a New Database

To create a new database:

```bash
mydb create
```

This command will guide you through a series of prompts to select a database type (e.g., MySQL, PostgreSQL), enter a name for your new database, and choose a server location.
