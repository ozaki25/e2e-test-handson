# 3.RegSuitで画像回帰テスト

## RegSuitとは

- キャプチャ載せる

## 事前準備

### Github

#### アカウント作成

- 以下のページからアカウントを作成してください
    - [https://github.com/](https://github.com/)

#### リポジトリの作成

- アカウントを作成してログインできたら以下のURLからリポジトリを作成してください
    - [https://github.com/new](https://github.com/new)

![new repository](/images/3-0.png)

- 表示されているURLをコピーしておきます

![repository url](/images/3-6.png)

#### コードのアップロード

- `.gitignore`というファイルを作成して以下の内容を記述します
    - ライブラリが入っている`node_modules`はgit管理の対象外とするように設定します

```
node_modules
```

- puppeteer-sample直下で以下のコマンドを順番に実行していきます
    - 2番目のコマンドのURLはリポジトリ作成時にコピーしたものをセットしてください
    - 最後のコマンド実行後にメールアドレス/パスワードを求められる場合はGitHubのアカウント作成時に設定したものを入力してください

```sh
git init
git remote add origin https://github.com/xxxx
git add .
git commit -m "e2e handson"
git push origin master
```

### AWS

- 今回はAWSのS3を使います

#### アクセスキーの発行

- ※7/14のハンズオン参加者は発行済のキーを展開します
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

- reg-suitをインストール

```sh
npm i -g reg-suit
```

### 設定ファイルの作成

- reg-suitのスターターコマンドで設定ファイルを作成します
    - いくつか質問されるので手順に従って進めてください
- puppeteer-sampleフォルダ直下で以下のコマンドを実行します

```sh
reg-suit init --use-yarn
```

- 最初の質問はデフォルトのままでエンターを押します
    - 3つ選択されている状態になっています
    - 設定を変えたい場合上下キーで移動しスペースキーで選択できます

![regsuit init 1](/images/3-1.png)

- 次の質問もデフォルトのままエンターを押します
    - 設定ファイルの配置フォルダを`.reg`に設定している

![regsuit init 2](/images/3-2.png)

- 次の質問もデフォルトのままエンターを押します
    - `.reg`を`.gitignore`に記載するかどうか聞いています

![regsuit init 7](/images/3-7.png)

- 次は`screenshots`と入力してエンターを押す
    - スクリーンショットが保存されているディレクトリを指定しています

![regsuit init 3](/images/3-3.png)

- 次の質問はデフォルトのままエンターを押します
    - 画像比較の厳密度を指定しています

![regsuit init 4](/images/3-4.png)

- 次はそのままエンターを押すとブラウザが開きます
    - この章の初めに作成したGitHubのリポジトリを指定します

![regsuit init 5](/images/3-5.png)

- RegSuitがリポジトリへアクセスすることを求めてくるので`Authorize`を選択します

![regsuit init 11](/images/3-11.png)

- `Configure`を押します

![regsuit init 12](/images/3-12.png)

- GitHubとRegSuitの連携をするため`install`を選択します

![regsuit init 16](/images/3-16.png)

- 作成したリポジトリの`Get Client ID`を押します

![regsuit init 13](/images/3-13.png)

- 表示されるClientは次の質問の回答なのでコピーしておきます

![regsuit init 14](/images/3-14.png)

- ターミナルに戻ると次の質問でClientIDを聞かれているので今コピーした値を貼り付けます

![regsuit init 15](/images/3-15.png)

- 次にS3のバケットを新規作成するか聞かれるのでそのままエンターを押します

![regsuit init 17](/images/3-17.png)

- S3のバケットが自動で作成されます

::: tip
- AccessDeniedとなる場合はAWSのアクセスキーが設定されていることを再確認してください
- [アクセスキーの設定](#アクセスキーの設定)
:::

- 次にconfigを更新するか聞かれるのでそのままエンターを押します

![regsuit init 18](/images/3-18.png)

- 最後にサンプル画像を配置するか聞かれるので`n`を入力してエンターを押します

![regsuit init 19](/images/3-19.png)

- これでRegSuitのセットアップは完了です

## CIの設定追加

- 今回はGitHub上でプルリクエストを出した時に自動でRegSuitを実行して結果を表示するようにしてみます
    - 自動実行にはGitHub ActionsというCIサービスを使います
- GitHub Actionsの設定ファイルを作成します
    - `.github/workflows`フォルダを作成してその中に`deploy.yml`を作成してください

![github actions](/images/3-8.png)

```yml{26-28}
name: test
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Use Node.js 14
        uses: actions/setup-node@v1
        with:
          node-version: 14
      - name: install
        run: |
          yarn install
      - name: test
        run: |
          npx jest
      - name: detached HEAD
        run: |
          git checkout ${GITHUB_REF#refs/heads/} || git checkout -b ${GITHUB_REF#refs/heads/} && git pull
      - name: regsuit
        run: |
          npx reg-suit run
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

- jobsで `ライブラリのインストール〜Puppeteerの実行〜RegSuitの実行を` を定義しています
- 最後の行でAWSのアクセスキーを環境変数から取得するように書いてあります
    - キー情報を直接埋め込むと悪用されてしまうのでこのようにして環境変数から渡します
- 環境変数はGitHubのWebページ上から設定します
    - 作成したリポジトリのページを開き`Settings`-`Secrets`-`New secret`から登録します

![seacret](/images/3-9.png)

- この章の最初で用意したAWSのアクセスキーを登録します
    - `AWS_ACCESS_KEY_ID`: アクセスID
    - `AWS_SECRET_ACCESS_KEY`: シークレットアクセスキー

![access key](/images/3-10.png)

## GitHubにプッシュ

- masterにプッシュしておいて、devにプッシュしてプルリク作成

