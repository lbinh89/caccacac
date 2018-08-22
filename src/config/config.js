'use strict';
/**
 * object variable for config
 * @type {{port: {app: number, jsonServer: number}, errors: {status: {ok: number, internalServerError: number, notFound: number}, number: {processExit: number}, errorCode: {permissionDenied: string, addressInUsed: string}}}}
 */
const config = {
  port: {
    app: 8080,
    jsonServer: 3333,
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
