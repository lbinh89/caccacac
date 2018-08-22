FORMAT: 1A
HOST:http://localhost:8000

# Mailing list management REST API

## Overview

- Y!Jのメーリングリスト管理者が利用するML管理用のREST API
- ML管理業務のユースケースに対応した、次の操作を提供する
  - MLの一覧を取得する(Show mailing list)
  - MLを登録する(Regist mailing list)
  - MLを削除する(Delete mailing list)

## Common specification

### 標準

- [HTTP Status codes](https://tools.ietf.org/html/rfc7231)
- [JSON Schema](http://json-schema.org/)

### プロトコル

HTTP

### フォーマット

JSON

### 文字コード

UTF-8

### エスケープ文字

`\n` を使用します

### レスポンス

HTTPステータスコードが `2xx` であれば正常終了、それ以外はエラー処理とみなします。
エラー処理で扱う、具体的なステータスコードは [RFC 7231](https://tools.ietf.org/html/rfc7231) に従うものとします。

エラー時には下記情報を含む [JSON](http://json-schema.org/) データをレスポンスとして受取ります。

| Key   | Sub key | Value                                                |
|-------|---------|------------------------------------------------------|
| id    |         | エラーIDです。問い合わせの際に利用します。UUIDv4形式 |
| error | code    | エラーの種類を表すコードです。                       |
|       | message | エラーメッセージが表示されます。                     |

```javascript
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "error": {
    "code": "ERR_MAIL_FORMAT_INVALID",
    "message": "メールアドレスが不正なため、登録ができませんでした。形式をチェックしてください。"
  }
}
```

### 認証

このプロジェクトでは使用しない

# Group Mailing list

## Set of mailing list [/list{?limit,offset}]

### Show all mailing list [GET]

メーリングリストの一覧を表示する

- Parameters

  - limit: `10` (number, optional) - 一覧で返すメーリングリストの件数
  - offset: `2` (number, optional) - 先頭のメーリングリストからlimit分だけ移動する件数、offset=2,     limit=10なら、21-30件目を表示する

- Response 200 (application/json)
  - Attributes (MailingListSet)

- Response 404 (application/json)
  - Attributes (ErrorMlAllNotFound)

### Regist set of mailing list [POST]

- 1-100件のメーリングリストを登録する
  - 100件を超えた場合は、全件の登録をキャンセルして受け付けない
- 登録に成功したメーリングリストの一覧を返す
  - 1つでも既に存在するメーリングリストが存在する場合、登録を全てキャンセルする

- Request (application/json)
  - Attributes (RequestMailingListSet)

- Response 201 (application/json)
  - Attributes (MailingListSet)

- Response 400 (application/json)
  - Attributes (ErrorMlFormatInvalid)

- Response 409 (application/json)
  - Attributes (ErrorMlAlreadyExsits)

## mailing list [/list/{id}]

### Show mailing list [GET]

メーリングリストを表示する

- Parameters
  - id: `1` (number, required) - メーリングリストのID、ユニーク

- Response 200 (application/json)
  - Attributes (MailingList)

- Response 404 (application/json)
  - Attributes (ErrorMlNotFound)

### Delet mailing list [DELETE]

メーリングリストを削除する

- Parameters
  - id: `1` (number, required) - メーリングリストのID、ユニーク

- Response 204

- Response 404 (application/json)
  - Attributes (ErrorMlNotFound)

# Data Structures

## Post requests

### RequestMailingListSet (array, fixed-type)

- (RequestMailingListA)
- (RequestMailingListB)

### RequestMailingList (array, fixed-type)

- (RequestMailingListA)

## Post response

### MailingListSet (array, fixed-type)

- (MailingListA)
- (MailingListB)

### MailingList (array, fixed-type)

- (MailingListA)

### MailingListA (object)

- id: 1 (number, required) - ID。システムが生成する。
- name: `Yahoo! users mailing list` (string, required) - メーリングリスト名
- address: `yahoo-users@ml.your.domain.jp` (string, required) - メーリングリストのアドレス

### MailingListB (object)

- id: 100 (number, required) - ID。システムが生成する。
- name: `Yahoo! admin. ml` (string, required) - メーリングリスト名
- address: `yahoo-admin@ml.your.domain.jp` (string, required)- メーリングリストのアドレス

### RequestMailingListA (object)

- name: `Yahoo! users mailing list` (string, required) - メーリングリスト名
- address: `yahoo-users@ml.your.domain.jp` (string, required) - メーリングリストのアドレス

### RequestMailingListB (object)

- name: `Yahoo! admin. ml` (string, required) - メーリングリスト名
- address: `yahoo-admin@ml.your.domain.jp` (string, required)- メーリングリストのアドレス

## Error messages

### ErrorMlAllNotFound (object)

- id: `550e8400-e29b-41d4-a716-446655440000` (string, required) - 問い合わせID
- error
  - code: `ERR_ML_NOT_FOUND` (string, required) - エラーコード
  - message: `メーリングリストが存在しません。メーリングリストを登録してください。` (string, required) - エラーメッセージ

### ErrorMlNotFound (object)

- id: `550e8400-e29b-41d4-a716-446655440000` (string, required) - 問い合わせID
- error
  - code: `ERR_ML_NOT_FOUND` (string, required) - エラーコード
  - message: `指定したメーリングリストが存在しません。メーリングリスト一覧を確認してください。` (string, required) - エラーメッセージ

### ErrorMlAlreadyExsits (object)

- id: `550e8400-e29b-41d4-a716-446655440000` (string, required) - 問い合わせID
- error
  - code: `ERR_ML_ALREADY_EXSTS` (string, required) - エラーコード
  - message: `次のメーリングリストは既に存在します。更新が必要な場合は一度、削除してください。<<your@mailing.list.name>>, ... , <<your2@mailing.list.name>>` (string, required) - エラーメッセージ

### ErrorMlFormatInvalid (object)

- id: `550e8400-e29b-41d4-a716-446655440000` (string, required) - 問い合わせID
- error
  - code: `ERR_ML_FORMAT_INVALID` (string, required) - エラーコード
  - message: `登録するメーリングリストの形式が不正で登録できませんでした。形式を確認してください。` (string, required) - エラーメッセージ
