# multi-integration

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=69338b20-fd5f-439d-bf2c-2b1473ca5712&metric=alert_status)](https://sonarcloud.io/dashboard?id=69338b20-fd5f-439d-bf2c-2b1473ca5712)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=69338b20-fd5f-439d-bf2c-2b1473ca5712&metric=bugs)](https://sonarcloud.io/dashboard?id=69338b20-fd5f-439d-bf2c-2b1473ca5712)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=69338b20-fd5f-439d-bf2c-2b1473ca5712&metric=code_smells)](https://sonarcloud.io/dashboard?id=69338b20-fd5f-439d-bf2c-2b1473ca5712)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=69338b20-fd5f-439d-bf2c-2b1473ca5712&metric=coverage)](https://sonarcloud.io/dashboard?id=69338b20-fd5f-439d-bf2c-2b1473ca5712)

Node.js module to create multi integration code that will run on some providers, for local or remote environments.

## Providers

- [x] Express.js
- [ ] fastify - Doing
- [ ] Google Cloud Run - Wait List
- [ ] Aws Lambda - Wait List

## How it Works?

This lib basic enable the creation of routes that will be interpreted on the entry point of each technology.

The structure is:

```node
const routes = [
    {
        "pattern": "/path",
        "method": "get",
        "exec": (params) => fPath(params)
    },
    {
        "pattern": "/queryParam",
        "method": "get",
        "exec": (params) => fQueryString(params)
    },
    {
        "pattern": "/pathParam/:x/value/:y",
        "method": "get",
        "exec": (params) => fParams(params)
    },
    {
        "pattern": "/a/b/c/d/ee/ff/zz",
        "method": "get",
        "exec": (params) => fCompletePathparams)
    }
]
```

The `params` parameter have this properties:
```json
  {
    "path": "url",
    "method": "http method",
    "queryString": "object with all query string values",
    "body": "body json message",
    "headers": "object with all headers",
    "pathParamsAttr": "object with all path params according to the route defined"
  }
```

All `exec` functions should be async.

## Behaviour

When you define the routes, the paths will be interpreted in the order of declaration and it will execute the function associated to the exec property.

Have a look to the [multi-integration-library-test](https://github.com/brunopenso/multi-integration-library-test) on how to implement a multi technology integration that will enable you to port your code from local to any providers without changing any code.

## Local testing

To test in a local environment you need to make this module available for other projects in your machine.

Execute this steps:

```bash
cd multi-integration-library
npm link
```

In the `multi-integration-library-test`:

```bash
cd multi-integration-library-test
npm link multi-integration-library
```

## History

I decided to create this lib to make my tests, POCs and POAs easier to run.

In March 2021, I came across to this [text](https://www.infoq.com/articles/serverless-microservices-flexibility/) from infoq that is related to my idea

## How to publish new version to NPM
1. Change package.json version
2. Commit and wait the CI to finish
3. Create a release on github interface
4. Wait for the CD to finish
5. Check npmjs.com for the package
