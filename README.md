# multi-integration

Node js module to create multi integration to run on kubernets, google cloud functions, aws lambda and express for local testing

This lib basic enable the creation of routes that will be interpreted on the entry point of each technology.

The structure is:

```node
const routes = [
    {
        "pattern": "/path",
        "method": "get",
        "exec": (params) => fPath()
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
        "exec": (params) => fCompletePath()
    }
]
```

When you define the routes the paths will be interpreted in the order of declaration and it will execute the function associated to the exec property.

Have a look to the [multi-integration-test](https://github.com/brunopenso/multi-integration-test) on how to implement a multi technology integration that will enable you to port your code from kubernets to aws lambda or google cloud functions

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
