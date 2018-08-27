'use strict';

const errorMessage = {
    Require: " 次のフィールドが存在しないため、登録できませんでした。登録フォーマットを確認してください。",
    Format: "次の形式が不正で登録できませんでした。形式を確認してください。",
    OutOfRange: "登録件数が超えています。メールは1から100の範囲で入力してください。",
    InternalServer: "内部サーバエラー発生しました。管理者にご連絡してください。",
    AlreadyExist: "登録件数が超えています。メールは1から100の範囲で入力してください。",
};

export default errorMessage;
