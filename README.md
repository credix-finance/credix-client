# Credix Client

Repository containing the client code to interact with Credix marketplaces.

# Development

## Editors

We use eslint and prettier to lint and format our codebase. An editorconfig file is also provided.

### Visual Studio Code

#### Extensions

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

##### Optional but recommended

- [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) A VS Code extension that allows you to toggle formatting settings ON and OFF with a simple click.

# Usage

## Local usage in other projects

### Link

#### NPM

To get started:

- Run `npm link` inside the client repository
- Run `npm link @credix/credix-client` inside your other project

When you are done

- Run `npm unlink @credix/credix-client` inside the other project

#### YARN

To get started:

- Run `yarn link ~/path/to/credix-client` inside the other project
- Copy the new resolutions entry in `package.json` to the dependencies
- Run `yarn`

When you are done

- Remove both entries
