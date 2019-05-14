# classyfhir

This is a proof of concept project.  It may live.  It may die.  It may stagnate between those states for a long time. We do not know.

# Setting Up the Environment

To use this project, you should perform the following steps:

1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [Yarn](https://yarnpkg.com/en/docs/install)
3. Execute the following from this project's root directory: `yarn`

# Using classyfhir

Right now the only thing you can do is generate simple classes:

```sh
node src/generate.js
```

You can also run the tests:

```sh
yarn test
```

# Linting the Code
To encourage quality and consistency within the code base, all code should pass eslint without any warnings.  Many text editors can be configured to automatically flag eslint violations.  We also provide an npm script for running eslint on the project.  To run eslint, execute the following command:
```
$ yarn lint
```