# 1.Puppeteerでブラウザを自動操作する

## Puppeteerとは

- Chromeを自動操作できるJavaScriptのライブラリ
- [https://pptr.dev/](https://pptr.dev/)

## セットアップ

- サンプルプロジェクトのフォルダを作成する

```sh
mkdir puppeteer-sample
cd puppeteer-sample
```

- ライブラリのインストール
    - ファイルサイズが大きい(200MBくらい)ので2つめのコマンドがけっこう時間かかります

```sh
yarn init -y
yarn add puppeteer
```

## Puppeteerを動かしてみる

- Puppeteerを使ってブラウザを自動操作し[https://example.com](https://example.com)にアクセスしてみます
- プロジェクト直下(`puppeteer-sample`フォルダ内)に`index.js`というファイルを作成して以下の内容を記述してください

```js
const puppeteer = require('puppeteer');

(async () => {
  // 動作が分かりやすいように headless: false と slowMoを設定している
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  // ページにアクセス
  await page.goto('https://example.com');

  // スクリーンショットほ保存
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
```

::: tip
- launchの引数に `headless: false` を設定するとheadlessモードではなくなってブラウザが立ち上がるようになる
- launchの引数に `slowMo: 300` のように値を設定すると動作するスピードが遅くなって何をしているか目で確認しやすくなる
:::

- 以下のコマンドで実行してみましょう

```sh
node index.js
```

- ブラウザが自動で立ち上がってページが表示されたはずです
- さらに`example.png`という名前でスクリーンショットが保存されています

![example](/images/1-1.png)

- URLを変更すれば別のページにもアクセスできるので試してみましょう

