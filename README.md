# mydbportal-cli

## Description:
mydbportal CLI is a  command-line tool that helps developers connect to and manage their databases on mydbportal.com

## Installation

```bash
npm install -g mydbportal-cli
```

## Usage

Follow these steps to use the `mydbportal-cli`:

### Step 1: Create account on mydbportal.com

### Step 2: Before you can use any other commands, you need to log in to your mydbportal cli.

```bash
npx mydb login
```

This command will open a browser window, prompting you to authenticate with your Google account. Once authenticated, you can close the browser tab.

### Commands

 list all your available databases:
```bash
npx mydb list
```

To create a new database run this command inside your project:

```bash
npx mydb create
```
