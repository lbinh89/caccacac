const fixtures = {
  port: {
    app: 8000,
    jsonServer: 3003,
    appTestJsonServer: 3004,
    routesIndexTestJsonServer: 3005,
    mailIndexTestJsonServer: 3006,
    mailClassTestJsonServer: 3007,
  },
  httpStatus: {
    OK: {
      status: 200,
    },
    FORMAT_INVALID: {
      status: 400,
      code: "ERR_ML_FORMAT_INVALID"
    },
    OUT_OF_RANGE: {
      status: 400,
      code: "ERR_MAIL_NUMBER_OUTOFRANGE"
    },
    IS_EXIST: {
      status: 409,
      code: "ERR_ML_ALREADY_EXIST"
    },
    INTERNAL_SERVER: {
      status: 500,
      code: "ERR_ML_INTERNAL_SERVER"
    }
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
    stubAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b439c",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "{address}がありませんでした。{address}を入力してください。"
          }
      }`,
    },
  },
};
export default fixtures;
