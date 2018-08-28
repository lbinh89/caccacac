'use strict';
/**
 * object variable for config
 * @type {{port: {app: number, jsonServer: number}, errors: {status: {ok: number, internalServerError: number, notFound: number}, number: {processExit: number}, errorCode: {permissionDenied: string, addressInUsed: string}}}}
 */
const config = {
  port: {
    app: 8000,
    jsonServer: 3003,
  },
  httpStatus: {
    OK: {
      status: 200,
    },
    CREATED: {
        status: 201,
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
    errorCode: {
      permissionDenied: 'EACCES',
      addressInUsed: 'EADDRINUSE',
    },
    message: {
      getMailList: {
        error: {
          message:
            '取得時にエラーが発生しました。 しばらくしてからやり直してください。',
        },
      },
    },
    number: {
      processExit: 1,
    },
    status: {
      ok: 200,
      internalServerError: 500,
      notFound: 404,
    },
  },
};

export default config;
