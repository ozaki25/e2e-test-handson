# 3.RegSuitで画像回帰テスト

## RegSuitとは

- キャプチャ載せる

## 事前準備

### Github

- アカウント作る
- 以下のページからアカウントを作成してください
    - [https://github.com/](https://github.com/)

### AWS

- 今回はAWSのS3というサービスを使います

#### アクセスキーの発行

- ※7/14のハンズオン参加者は発行済のキーて展開しますのでこの手順はスキップして[アクセスキーの設定](#アクセスキーの設定)に進んでください
- AWSのアカウントを作成し以下の手順に従ってアクセスキーを発行してください
    - [https://qiita.com/ozaki25/items/034f7f8e8ad69adceea7](https://qiita.com/ozaki25/items/034f7f8e8ad69adceea7)

::: danger
- 発行したキー情報は漏洩することがないように取り扱いに注意してください
:::

#### アクセスキーの設定

- アクセスキーが発行できたら以下のコマンドでキーを設定します

```sh
export AWS_ACCESS_KEY_ID=アクセスキーID
export AWS_SECRET_ACCESS_KEY=シークレットアクセスキー
```

::: tip
- このコマンドはターミナルを閉じるとリセットされてしまうので、ターミナルを開き直した場合は再度実行してください
:::


## RegSuitの導入

### ライブラリの追加

```sh
npm i -g reg-suit
```

### 設定ファイルの作成

```sh
reg-suit init --use-yarn
```

- 手順キャプチャで
- S3のバケットセットアップも

## テストの修正

- screenshotの保存先


## CIの設定追加

- GitHub Actionsのファイル作成


## GitHubにプッシュ

- masterにプッシュしておいて、devにプッシュしてプルリク作成

