const fixtures = {
  port: {
    app: 8000,
    jsonServer: 3003,
    appTestJsonServer: 3004,
    routesIndexTestJsonServer: 3005,
    mailIndexTestJsonServer: 3006,
    mailClassTestJsonServer: 3007,
  },
  errors: {
    status: {
      ok: 200,
      created: 201,
      deleted: 204,
      notFound: 404,
      internalServerError: 500,
    },
    number: {
      processExit: 1,
    },
    errorCode: {
      permissionDenied: 'EACCES',
      addressInUsed: 'EADDRINUSE',
    },
  },
  testValues: {
    MailTest: {
      constructor: {
        url: 'http://localhost:3003',
        path: '/ml',
      },
    },
    stubReturnValue: {
      status: 200,
      body: '{"text":"Dummy Test"}',
    },
  },
};
export default fixtures;
