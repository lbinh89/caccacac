'use strict';

const errorString = {
    codeRequire: "ERR_ML_FORMAT_INVALID",
    messageRequire: "{param}がありませんでした。{param}を入力してください",

    codeFormat: "ERR_ML_FORMAT_INVALID",
    messageFormat: "登録するメーリングリストの形式が不正で登録できませんでした。形式を確認してください",

    codeOutOfRange: "ERR_MAIL_NUMBER_OUTOFRANGE",
    messageOutOfRange: "登録件数が超えています。メールは1から100の範囲で入力してください",
};

export default errorString;
