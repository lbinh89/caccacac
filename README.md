# autoreply-prototype
prototype app for auto reply system

# Node Guideline

```
# nodebrewインストール
$ brew install nodebrew

# リモートで管理されているNode.jsのバージョンを調べる
$ nodebrew ls-remote

# 下コマンドで curl: (23) Failed writing body となるので、ディレクトリの作成を実行
$ mkdir -p .nodebrew/src/v8.11.2/

# 今回はLTS（ https://github.com/nodejs/LTS ）のv8.11.2をインストール
$ nodebrew install-binary v8.11.2

# インストールしたすべてのnodeのバージョンを確認
$ nodebrew ls

# 使いたいバージョンを指定
$ nodebrew use v8.11.2

# currentのパスを追加 (~/.bashrcか~/.bash_profileに追加することをお勧め)
$ export PATH=~/.nodebrew/current/bin:$PATH
```

# ESDoc Guideline

### ソースコード先
`./src/`

### ドキュメント生成先
`./docs/esdoc/`

### テストファイル先
`./test/`

### プロジェクトのディレクトリに移動
`cd your-project/`

### ESDoc と標準プラグインをインストール
`npm install --dev`

### ドキュメントを出力し、閲覧する
`npm run esdoc`

# API speficication document

## Build
`npm run apidoc`

## Live edit
`npm run live:apidoc`
