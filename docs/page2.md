# 2.Jestでテストする

## 2-1.Jestとは

- JavaScriptのテストライブラリ
- [https://jestjs.io/ja/](https://jestjs.io/ja/)

## 2-2.Jestでテストしてみよう

- 1章の続きのフォルダで進めていきます
- まずはPupeteerは置いておいてJest単体で簡単なテストを書いてみます

### ライブラリの追加

- Jestをインストールします

```sh
yarn add -D jest
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

## Topic3
