# 1.Puppeteerでブラウザを自動操作する

## 1-1.Puppeteerとは

- Chromeを自動操作できるJavaScriptのライブラリ
- 公式サイト
    - [https://pptr.dev/](https://pptr.dev/)

## 1-2.セットアップ

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

## 1-3.Puppeteerでページにアクセスしてみよう

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
- launchの引数に`headless: false`を設定するとheadlessモードではなくなってブラウザが立ち上がるようになる
- launchの引数に`slowMo: 300`のように値を設定すると動作するスピードが遅くなって何をしているか目で確認しやすくなる
- launchに引数を渡さずに動かすとheadlessモードで動くのでブラウザは立ち上がらずに実行されます
:::

- 以下のコマンドで実行してみましょう

```sh
node index.js
```

- ブラウザが自動で立ち上がってページが表示されたはずです
- さらに`example.png`という名前でスクリーンショットが保存されています

![example](/images/1-1.png)

- URLを変更すれば別のページにもアクセスできるので試してみましょう

## 1-4.Puppeteerでページを操作してみよう

- ページを表示することができるようになったので次はページを操作してみます
- [http://google.com/](http://google.com/)にアクセスして`puppeteer`を検索して[Puppeteerのリポジトリ](https://github.com/puppeteer/puppeteer)にアクセスしてみます

### Googleにアクセスする

- 前の節の復習です
- Googleにアクセスするように`index.js`を修正してみましょう

```js{7-8}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  // Googleにアクセス
  await page.goto('https://google.com');

  await browser.close();
})();
```

- 以下のコマンドで実行するとGoogleが表示されるはずです

```sh
node index.js
```

### 文字を入力する

- Googleの検索窓に文字を入力してみます
- `page.type()`を使うことで文字を入力させることができます
- `index.js`を修正しましょう

```js{8-9}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  // typeの第1で要素を特定して、第2引数で入力内容を指定する
  await page.type('input[name="q"]', 'puppeteer');

  await browser.close();
})();
```

::: tip
- Googleの検索窓のinputタグはname属性にqが設定されているのでそれを使って要素を特定している
- idやテスト用の属性を設定していれば場合はそれらを活用するとよい
- DevtoolsはF12もしくは右クリックで検証から表示できる

![google input](/images/1-2.png)
:::

- `node index.js`で実行すると文字が入力されている様子を確認できると思います

### ボタンをクリックする

- 検索ワードの入力ができたので`Google 検索`ボタンを押して検索させてみます
- クリックは`page.click()`使います
- `index.js`を修正しましょう

```js{9-10}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  await page.type('input[name="q"]', 'puppeteer');
  // 指定した要素をクリックする
  await page.click('input[name="btnK"]');

  await browser.close();
})();
```

- `Google 検索`ボタンはinputタグでname属性がbtnKなのでそれを利用してボタンを特定しています
- `node index.js`を実行するとボタンのクリックまで動作すると思います

### ページの表示を確認

- clickだけではボタンを押すだけで終わってしまいます
- 検索結果の画面が表示されるまで待つようにしてみましょう
- `page.waitForNavigation()`を使うと遷移が完了するまで待つようになります
- `index.js`を修正しましょう

```js{10-14}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  await page.type('input[name="q"]', 'puppeteer');

  await Promise.all([
    page.click('input[name="btnK"]'),
    // 遷移が完了するまで待つ
    page.waitForNavigation(),
  ]);

  await browser.close();
})();
```

- `node index.js`を実行すると検索結果までちゃんと表示されるようになりました

### 検索結果から公式サイトにアクセス

- 最後にこれまでのやり方を活用して検索結果からPuppeteerのリポジトリにアクセスします
- `index.js`を修正しましょう

```js{14-19}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  await page.type('input[name="q"]', 'puppeteer');
  await Promise.all([
    page.click('input[name="btnK"]'),
    page.waitForNavigation(),
  ]);

  await Promise.all([
    // href属性が https://github.com/puppeteer/puppeteer のaタグをクリック
    page.click('a[href="https://github.com/puppeteer/puppeteer"]'),
    // 遷移が完了するまで待つ
    page.waitForNavigation(),
  ]);

  await browser.close();
})();
```

- 検索結果画面からPuppeteerのリポジトリのリンクをクリックしてページが表示されるまで待つようにしてみました
- `node index.js`で実行すると以下のような動作になっているはずです

![demo](/images/1-3.gif)

### スクリーンショットを保存する

- 各動作ごとにスクリーンショットを保存するようにしてみます
- `index.js`を修正しましょう

```js{8,11,17,23}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  await page.goto('https://google.com');
  await page.screenshot({ path: '1.png', fullPage: true });

  await page.type('input[name="q"]', 'puppeteer');
  await page.screenshot({ path: '2.png', fullPage: true });

  await Promise.all([
    page.click('input[name="btnK"]'),
    page.waitForNavigation(),
  ]);
  await page.screenshot({ path: '3.png', fullPage: true });

  await Promise.all([
    page.click('a[href="https://github.com/puppeteer/puppeteer"]'),
    page.waitForNavigation(),
  ]);
  await page.screenshot({ path: '4.png', fullPage: true });

  await browser.close();
})();
```

- 実行するとスクリーンショットが保存されました

![screenshot](/images/1-4.png)

## 1-5.まとめ

- Puppeteerを使ってブラウザを自動操作しWebページにアクセスしました
- 文字の入力やボタンのクリックといった操作も実行できました
- 任意のタイミングでスクリーンショットを保存することができました

## 1-6.参考情報

- ここで紹介した以外にもいろいなことができるので[公式サイト](https://pptr.dev/)や[公式が提供するサンプル](https://try-puppeteer.appspot.com/)を参考にしてみてください