# 2.Jestでテストする

## 2-1.Jestとは

- JavaScriptのテストライブラリ
    - Javaで言うところのJUnitのようなもの
- [https://jestjs.io/ja/](https://jestjs.io/ja/)

## 2-2.ゴール

- Jestを使った簡単なテストが書けること
- Puppeteerと組み合わせってテストが実行できること

## 2-3.Jestでテストしてみよう

- 1章の続きのフォルダで進めていきます
- まずはPupeteerは置いておいてJest単体で簡単なテストを書いてみます

### ライブラリの追加

- Jestをインストールします

```sh
yarn add jest
```

### テストの作成

- まずはテスト対象となる関数を作っておきます
- `calc.js`を作成して以下の内容を記述してください

```js
function add(a, b) {
  return a + b;
}

module.exports = { add };

```

- テストを作成します
- `calc.test.js`を作成して以下の内容を記述してください

```js
const { add } = require('./calc');

describe('足し算のテスト', () => {
  test('1と2を渡すと3が返ること', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

::: tip
- Jestは`__tests__`フォルダ内にある`xxx.js`のファイルや、ファイル名が`xxx.test.js` `xxx.spec.js`のファイルなどをテスト対象であると自動で認識してテストを実行します
:::

### テストの実行

- テストは以下のコマンドで実行します

```sh
npx jest
```

::: tip
- `npx jest --watch`とwatchオプションをつけるとファイルの変更を監視して変更時に自動で再実行されるようになります
- 他にも`--coverage`をつけるとカバレッジがとれるなどあるので[公式のリファレンス](https://jestjs.io/docs/ja/cli#%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9)を確認してください
:::

- 実行すると以下のような実行結果が表示されます

![jest result success](/images/2-1.png)


- テストが失敗した時はその内容が表示されます

![jest result failed](/images/2-2.png)

- テストケースがいくつかある場合はこのような感じです

![jest result](/images/2-3.png)

- 参考

```js
// calc.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

```js
// calc.test.js
const { add, subtract } = require('./calc');

describe('calcのテスト', () => {
  describe('#add', () => {
    test('1と2を渡すと3が返ること', () => {
      expect(add(1, 2)).toBe(3);
    });
    test('-1と-2を渡すと-3が返ること', () => {
      expect(add(-1, -2)).toBe(-3);
    });
  });
  describe('#subtract', () => {
    test('2と1を渡すと1が返ること', () => {
      expect(subtract(2, 1)).toBe(1);
    });
    test('1と2を渡すと-1が返ること', () => {
      expect(subtract(1, 2)).toBe(-1);
    });
  });
});
```

## 2-4.JestでPuppeteerをテストしてみよう

- 1章で学んだPuppeteerを使った自動画面操作とJestを組み合わせてテストしてみます

### ライブラリのセットアップ

- JestとPuppeteerを共存させるためのライブラリをインストールします

```sh
yarn add jest-puppeteer
```

- Jestの設定ファイルを作成します
- `jest.config.js`を作成して以下の内容を記述してください

```js
module.exports = {
  preset: 'jest-puppeteer',
  verbose: true,
};
```

### テストの作成

- まずは[https://example.com](https://example.com)にアクセスする処理だけ書いてみましょう
- `example.test.js`を作成して以下の内容を記述してください

```js
describe('example', () => {
  beforeAll(async () => {
    await page.goto('https://example.com');
  });

  test('example.comにアクセスできること', async () => {
    const result = await page.title(); // ページのタイトルを取得
    const expected = 'Example Domain';
    expect(result).toBe(expected);
  });
});
```

### テストの起動

- 以下のコマンドでJestを起動するとPuppeteerのテストも実行されます

```sh
npx jest
```

- expectedの値を変更した場合にテストが落ちることも確認してみましょう

::: tip
- headlessで動作するためブラウザは立ち上がりません
- ブラウザを立ち上げたい場合は`jest-puppeteer.config.js`を作成して以下の内容を記述してください

```js
module.exports = {
  launch: {
    headless: false,
    slowMo: 300,
  },
};
```
:::

## 2-5.Google検索のテストを書いてみよう

- 1章で作成したGoogleでpuppeteerを検索してリポジトリに辿り着くまでに動作をテストしてみます

### テストの作成

- `google.test.js`を作成します

```js
describe('Googleでpuppeteerを検索してリポジトリにアクセスする', () => {
  beforeAll(async () => {
    // デフォルトのタイムアウトが5000msなので長めに設定し直す
    jest.setTimeout(30000);
  });

  test('Googleにアクセス', async () => {
    await page.goto('https://google.com');
    await page.screenshot({ path: 'screenshots/1.png', fullPage: true });
  });

  test('検索ワードを入力', async () => {
    await expect(page).toFill('input[name="q"]', 'puppeteer');
    await page.screenshot({ path: 'screenshots/2.png', fullPage: true });
  });

  test('検索ボタンを押して結果表示', async () => {
    await Promise.all([
      expect(page).toClick('input[name="btnK"]'),
      page.waitForNavigation(),
    ]);
    // id=searchの要素が画面にあることをチェック
    await expect(page).toMatchElement('#search');
    // id=result-statsの要素に`約 5,750,000 件`と表示されていることをチェック(件数はテストが通るように書き換えてください)
    await expect(page).toMatchElement('#result-stats', { text: '約 5,750,000 件' });
    await page.screenshot({ path: 'screenshots/3.png', fullPage: true });
  });

  test('Puppeteerのリポジトリを選択して遷移', async () => {
    await Promise.all([
      expect(page).toClick('a[href="https://github.com/puppeteer/puppeteer"]'),
      page.waitForNavigation(),
    ]);
    // `puppeteer/puppeteer`という文字列が画面上にあることをチェック
    await expect(page).toMatch('puppeteer/puppeteer');
    await page.screenshot({ path: 'screenshots/4.png', fullPage: true });
  });
});
```

- ほとんどが1章の流用ですが一部書き換えています
- `expect(page).toFill()`や`expect(page).toClick()`はjest-puppeteerが提供するassertion関数です
    - [https://github.com/smooth-code/jest-puppeteer/blob/master/packages/expect-puppeteer/README.md#api](https://github.com/smooth-code/jest-puppeteer/blob/master/packages/expect-puppeteer/README.md#api)
    - これらを使うと入力域やクリック対象のボタンが存在しなかった場合にテスト失敗としてくれます
- ※一つの`test()`にすべて書いてしまっても良さそうですが結果が見やすいので今回は分けてみました
- 以下のコマンドで実行します

```sh
npx jest google.test.js
```

::: tip
- `npx jest ファイル名`とファイル名を指定すると特定のファイルだけ実行することができます
:::

- うまくいくと以下のように出力されスクリーンショットも保存されているはずです

![jest puppeteer result success](/images/2-4.png)

- 表示内容が変わった時にテストが落ちる様子も見てみましょう
- `google.test.js`の25行目の検索結果件数を書き換えてテストを落としてみます

```js
    // テストが落ちるようにわざと件数を変えてみる
    await expect(page).toMatchElement('#result-stats', { text: '約 999,999,999 件' });
```

- キャプチャのように表示内容と異なる部分でちゃんとテストが落ちました

![jest puppeteer result failed](/images/2-5.png)

## 2-6.まとめ

- Jestを使うことでJavaScriptのテストを実行することができました
- jest-puppeteerを使うとPuppeteerの自動操作と組み合わせてテストすることができました
