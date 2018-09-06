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
      code: 'ERR_ML_FORMAT_INVALID',
    },
    OUT_OF_RANGE: {
      status: 400,
      code: 'ERR_MAIL_NUMBER_OUTOFRANGE',
    },
    IS_EXIST: {
      status: 409,
      code: 'ERR_ML_ALREADY_EXIST',
    },
    INTERNAL_SERVER: {
      status: 500,
      code: 'ERR_ML_INTERNAL_SERVER',
    },
    CREATED: {
      status: 201,
    },
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
    stubCreatedValue: {
      status: 201,
      body: '{"text":"Dummy Test"}',
    },
    stubServerDown: {
      status: 500,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4008",
          "error": {
              "code": "ERR_ML_INTERNAL_SERVER",
              "message": "内部サーバエラー発生しました。管理者にご連絡してください。"
          }
      }`,
    },
    stubAddressExist: {
      status: 409,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4008",
          "error": {
              "code": "ERR_ML_ALREADY_EXSTS",
              "message": "次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。<mail address1><mail address2>"
          }
      }`,
    },
    stubTwoNameAddressFormatIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4008",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次の形式が不正で登録できませんでした。形式を確認してください。name<index1>:<namevalue1>, mail address<index1>:<mailvalue1>, name<index2>:<namevalue2>, mail address<index2>:<mailvalue2>"
          }
      }`,
    },
    stubAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b439y",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address<index>"
          }
      }`,
    },
    stubTwoAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b434f",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。mail address<index1>, mail address<index2>"
          }
      }`,
    },
    stubAddressFormatIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4674",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次の形式が不正で登録できませんでした。形式を確認してください。mail address<index>:<value>"
          }
      }`,
    },
    stubTwoAddressFormatIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b469m",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次の形式が不正で登録できませんでした。形式を確認してください。mail address<index1>:<value1>, mail address<index2>:<value2>"
          }
      }`,
    },
    stubNameIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b439c",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。name<index>"
          }
      }`,
    },
    stubNameFormatIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4678",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次の形式が不正で登録できませんでした。形式を確認してください。name<index>:<value>"
          }
      }`,
    },
    stubTwoNameFormatIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c256-3dab-4958-95f4-6a0e014b4678",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次の形式が不正で登録できませんでした。形式を確認してください。name<index1>:<value1>, name<index2>:<value2>"
          }
      }`,
    },
    stubOutOfRange: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b439i",
          "error": {
              "code": "ERR_MAIL_NUMBER_OUTOFRANGE",
              "message": "登録件数が超えています。メールは1から100の範囲で入力してください。"
          }
      }`,
    },
    stubNameAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<name><index1>, <mail address><index2>"
          }
      }`,
    },
    stubOneHundredNameAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<name><index1>, <name><index2>, <name><index3>, <name><index4>, <name><index5>, <name><index6>, <name><index7>, <name><index8>, <name><index9>, <name><index10>, <name><index11>, <name><index12>, <name><index13>, <name><index14>, <name><index15>, <name><index16>, <name><index17>, <name><index18>, <name><index19>, <name><index20>, <name><index21>, <name><index22>, <name><index23>, <name><index24>, <name><index25>, <name><index26>, <name><index27>, <name><index28>, <name><index29>, <name><index30>, <name><index31>, <name><index32>, <name><index33>, <name><index34>, <name><index35>, <name><index36>, <name><index37>, <name><index38>, <name><index39>, <name><index40>, <name><index41>, <name><index42>, <name><index43>, <name><index44>, <name><index45>, <name><index46>, <name><index47>, <name><index48>, <name><index49>, <name><index50>, <name><index51>, <name><index52>, <name><index53>, <name><index54>, <name><index55>, <name><index56>, <name><index57>, <name><index58>, <name><index59>, <name><index60>, <name><index61>, <name><index62>, <name><index63>, <name><index64>, <name><index65>, <name><index66>, <name><index67>, <name><index68>, <name><index69>, <name><index70>, <name><index71>, <name><index72>, <name><index73>, <name><index74>, <name><index75>, <name><index76>, <name><index77>, <name><index78>, <name><index79>, <name><index80>, <name><index81>, <name><index82>, <name><index83>, <name><index84>, <name><index85>, <name><index86>, <name><index87>, <name><index88>, <name><index89>, <name><index90>, <name><index91>, <name><index92>, <name><index93>, <name><index94>, <name><index95>, <name><index96>, <name><index97>, <name><index98>, <name><index99>, <name><index100>, <mail address><index1>, <mail address><index2>, <mail address><index3>, <mail address><index4>, <mail address><index5>, <mail address><index6>, <mail address><index7>, <mail address><index8>, <mail address><index9>, <mail address><index10>, <mail address><index11>, <mail address><index12>, <mail address><index13>, <mail address><index14>, <mail address><index15>, <mail address><index16>, <mail address><index17>, <mail address><index18>, <mail address><index19>, <mail address><index20>, <mail address><index21>, <mail address><index22>, <mail address><index23>, <mail address><index24>, <mail address><index25>, <mail address><index26>, <mail address><index27>, <mail address><index28>, <mail address><index29>, <mail address><index30>, <mail address><index31>, <mail address><index32>, <mail address><index33>, <mail address><index34>, <mail address><index35>, <mail address><index36>, <mail address><index37>, <mail address><index38>, <mail address><index39>, <mail address><index40>, <mail address><index41>, <mail address><index42>, <mail address><index43>, <mail address><index44>, <mail address><index45>, <mail address><index46>, <mail address><index47>, <mail address><index48>, <mail address><index49>, <mail address><index50>, <mail address><index51>, <mail address><index52>, <mail address><index53>, <mail address><index54>, <mail address><index55>, <mail address><index56>, <mail address><index57>, <mail address><index58>, <mail address><index59>, <mail address><index60>, <mail address><index61>, <mail address><index62>, <mail address><index63>, <mail address><index64>, <mail address><index65>, <mail address><index66>, <mail address><index67>, <mail address><index68>, <mail address><index69>, <mail address><index70>, <mail address><index71>, <mail address><index72>, <mail address><index73>, <mail address><index74>, <mail address><index75>, <mail address><index76>, <mail address><index77>, <mail address><index78>, <mail address><index79>, <mail address><index80>, <mail address><index81>, <mail address><index82>, <mail address><index83>, <mail address><index84>, <mail address><index85>, <mail address><index86>, <mail address><index87>, <mail address><index88>, <mail address><index89>, <mail address><index90>, <mail address><index91>, <mail address><index92>, <mail address><index93>, <mail address><index94>, <mail address><index95>, <mail address><index96>, <mail address><index97>, <mail address><index98>, <mail address><index99>, <mail address><index100>"
          }
      }`,
    },
    stubOneHundredNameIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<name><index1>, <name><index2>, <name><index3>, <name><index4>, <name><index5>, <name><index6>, <name><index7>, <name><index8>, <name><index9>, <name><index10>, <name><index11>, <name><index12>, <name><index13>, <name><index14>, <name><index15>, <name><index16>, <name><index17>, <name><index18>, <name><index19>, <name><index20>, <name><index21>, <name><index22>, <name><index23>, <name><index24>, <name><index25>, <name><index26>, <name><index27>, <name><index28>, <name><index29>, <name><index30>, <name><index31>, <name><index32>, <name><index33>, <name><index34>, <name><index35>, <name><index36>, <name><index37>, <name><index38>, <name><index39>, <name><index40>, <name><index41>, <name><index42>, <name><index43>, <name><index44>, <name><index45>, <name><index46>, <name><index47>, <name><index48>, <name><index49>, <name><index50>, <name><index51>, <name><index52>, <name><index53>, <name><index54>, <name><index55>, <name><index56>, <name><index57>, <name><index58>, <name><index59>, <name><index60>, <name><index61>, <name><index62>, <name><index63>, <name><index64>, <name><index65>, <name><index66>, <name><index67>, <name><index68>, <name><index69>, <name><index70>, <name><index71>, <name><index72>, <name><index73>, <name><index74>, <name><index75>, <name><index76>, <name><index77>, <name><index78>, <name><index79>, <name><index80>, <name><index81>, <name><index82>, <name><index83>, <name><index84>, <name><index85>, <name><index86>, <name><index87>, <name><index88>, <name><index89>, <name><index90>, <name><index91>, <name><index92>, <name><index93>, <name><index94>, <name><index95>, <name><index96>, <name><index97>, <name><index98>, <name><index99>, <name><index100>"
          }
      }`,
    },
    stubOneHundredAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<mail address><index1>, <mail address><index2>, <mail address><index3>, <mail address><index4>, <mail address><index5>, <mail address><index6>, <mail address><index7>, <mail address><index8>, <mail address><index9>, <mail address><index10>, <mail address><index11>, <mail address><index12>, <mail address><index13>, <mail address><index14>, <mail address><index15>, <mail address><index16>, <mail address><index17>, <mail address><index18>, <mail address><index19>, <mail address><index20>, <mail address><index21>, <mail address><index22>, <mail address><index23>, <mail address><index24>, <mail address><index25>, <mail address><index26>, <mail address><index27>, <mail address><index28>, <mail address><index29>, <mail address><index30>, <mail address><index31>, <mail address><index32>, <mail address><index33>, <mail address><index34>, <mail address><index35>, <mail address><index36>, <mail address><index37>, <mail address><index38>, <mail address><index39>, <mail address><index40>, <mail address><index41>, <mail address><index42>, <mail address><index43>, <mail address><index44>, <mail address><index45>, <mail address><index46>, <mail address><index47>, <mail address><index48>, <mail address><index49>, <mail address><index50>, <mail address><index51>, <mail address><index52>, <mail address><index53>, <mail address><index54>, <mail address><index55>, <mail address><index56>, <mail address><index57>, <mail address><index58>, <mail address><index59>, <mail address><index60>, <mail address><index61>, <mail address><index62>, <mail address><index63>, <mail address><index64>, <mail address><index65>, <mail address><index66>, <mail address><index67>, <mail address><index68>, <mail address><index69>, <mail address><index70>, <mail address><index71>, <mail address><index72>, <mail address><index73>, <mail address><index74>, <mail address><index75>, <mail address><index76>, <mail address><index77>, <mail address><index78>, <mail address><index79>, <mail address><index80>, <mail address><index81>, <mail address><index82>, <mail address><index83>, <mail address><index84>, <mail address><index85>, <mail address><index86>, <mail address><index87>, <mail address><index88>, <mail address><index89>, <mail address><index90>, <mail address><index91>, <mail address><index92>, <mail address><index93>, <mail address><index94>, <mail address><index95>, <mail address><index96>, <mail address><index97>, <mail address><index98>, <mail address><index99>, <mail address><index100>"
          }
      }`,
    },
    stubNinetyNineNameAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<name><index1>, <name><index2>, <name><index3>, <name><index4>, <name><index5>, <name><index6>, <name><index7>, <name><index8>, <name><index9>, <name><index10>, <name><index11>, <name><index12>, <name><index13>, <name><index14>, <name><index15>, <name><index16>, <name><index17>, <name><index18>, <name><index19>, <name><index20>, <name><index21>, <name><index22>, <name><index23>, <name><index24>, <name><index25>, <name><index26>, <name><index27>, <name><index28>, <name><index29>, <name><index30>, <name><index31>, <name><index32>, <name><index33>, <name><index34>, <name><index35>, <name><index36>, <name><index37>, <name><index38>, <name><index39>, <name><index40>, <name><index41>, <name><index42>, <name><index43>, <name><index44>, <name><index45>, <name><index46>, <name><index47>, <name><index48>, <name><index49>, <name><index50>, <name><index51>, <name><index52>, <name><index53>, <name><index54>, <name><index55>, <name><index56>, <name><index57>, <name><index58>, <name><index59>, <name><index60>, <name><index61>, <name><index62>, <name><index63>, <name><index64>, <name><index65>, <name><index66>, <name><index67>, <name><index68>, <name><index69>, <name><index70>, <name><index71>, <name><index72>, <name><index73>, <name><index74>, <name><index75>, <name><index76>, <name><index77>, <name><index78>, <name><index79>, <name><index80>, <name><index81>, <name><index82>, <name><index83>, <name><index84>, <name><index85>, <name><index86>, <name><index87>, <name><index88>, <name><index89>, <name><index90>, <name><index91>, <name><index92>, <name><index93>, <name><index94>, <name><index95>, <name><index96>, <name><index97>, <name><index98>, <name><index99>, <mail address><index1>, <mail address><index2>, <mail address><index3>, <mail address><index4>, <mail address><index5>, <mail address><index6>, <mail address><index7>, <mail address><index8>, <mail address><index9>, <mail address><index10>, <mail address><index11>, <mail address><index12>, <mail address><index13>, <mail address><index14>, <mail address><index15>, <mail address><index16>, <mail address><index17>, <mail address><index18>, <mail address><index19>, <mail address><index20>, <mail address><index21>, <mail address><index22>, <mail address><index23>, <mail address><index24>, <mail address><index25>, <mail address><index26>, <mail address><index27>, <mail address><index28>, <mail address><index29>, <mail address><index30>, <mail address><index31>, <mail address><index32>, <mail address><index33>, <mail address><index34>, <mail address><index35>, <mail address><index36>, <mail address><index37>, <mail address><index38>, <mail address><index39>, <mail address><index40>, <mail address><index41>, <mail address><index42>, <mail address><index43>, <mail address><index44>, <mail address><index45>, <mail address><index46>, <mail address><index47>, <mail address><index48>, <mail address><index49>, <mail address><index50>, <mail address><index51>, <mail address><index52>, <mail address><index53>, <mail address><index54>, <mail address><index55>, <mail address><index56>, <mail address><index57>, <mail address><index58>, <mail address><index59>, <mail address><index60>, <mail address><index61>, <mail address><index62>, <mail address><index63>, <mail address><index64>, <mail address><index65>, <mail address><index66>, <mail address><index67>, <mail address><index68>, <mail address><index69>, <mail address><index70>, <mail address><index71>, <mail address><index72>, <mail address><index73>, <mail address><index74>, <mail address><index75>, <mail address><index76>, <mail address><index77>, <mail address><index78>, <mail address><index79>, <mail address><index80>, <mail address><index81>, <mail address><index82>, <mail address><index83>, <mail address><index84>, <mail address><index85>, <mail address><index86>, <mail address><index87>, <mail address><index88>, <mail address><index89>, <mail address><index90>, <mail address><index91>, <mail address><index92>, <mail address><index93>, <mail address><index94>, <mail address><index95>, <mail address><index96>, <mail address><index97>, <mail address><index98>, <mail address><index99>"
          }
      }`,
    },
    stubNinetyNineAddressIncorrect: {
      status: 400,
      body: `
        {
          "inquiryId": "4f22c2fa-3dab-4958-95f4-6a0e014b436t",
          "error": {
              "code": "ERR_ML_FORMAT_INVALID",
              "message": "次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。<mail address><index1>, <mail address><index2>, <mail address><index3>, <mail address><index4>, <mail address><index5>, <mail address><index6>, <mail address><index7>, <mail address><index8>, <mail address><index9>, <mail address><index10>, <mail address><index11>, <mail address><index12>, <mail address><index13>, <mail address><index14>, <mail address><index15>, <mail address><index16>, <mail address><index17>, <mail address><index18>, <mail address><index19>, <mail address><index20>, <mail address><index21>, <mail address><index22>, <mail address><index23>, <mail address><index24>, <mail address><index25>, <mail address><index26>, <mail address><index27>, <mail address><index28>, <mail address><index29>, <mail address><index30>, <mail address><index31>, <mail address><index32>, <mail address><index33>, <mail address><index34>, <mail address><index35>, <mail address><index36>, <mail address><index37>, <mail address><index38>, <mail address><index39>, <mail address><index40>, <mail address><index41>, <mail address><index42>, <mail address><index43>, <mail address><index44>, <mail address><index45>, <mail address><index46>, <mail address><index47>, <mail address><index48>, <mail address><index49>, <mail address><index50>, <mail address><index51>, <mail address><index52>, <mail address><index53>, <mail address><index54>, <mail address><index55>, <mail address><index56>, <mail address><index57>, <mail address><index58>, <mail address><index59>, <mail address><index60>, <mail address><index61>, <mail address><index62>, <mail address><index63>, <mail address><index64>, <mail address><index65>, <mail address><index66>, <mail address><index67>, <mail address><index68>, <mail address><index69>, <mail address><index70>, <mail address><index71>, <mail address><index72>, <mail address><index73>, <mail address><index74>, <mail address><index75>, <mail address><index76>, <mail address><index77>, <mail address><index78>, <mail address><index79>, <mail address><index80>, <mail address><index81>, <mail address><index82>, <mail address><index83>, <mail address><index84>, <mail address><index85>, <mail address><index86>, <mail address><index87>, <mail address><index88>, <mail address><index89>, <mail address><index90>, <mail address><index91>, <mail address><index92>, <mail address><index93>, <mail address><index94>, <mail address><index95>, <mail address><index96>, <mail address><index97>, <mail address><index98>, <mail address><index99>"
          }
      }`,
    },
  },
};
export default fixtures;
