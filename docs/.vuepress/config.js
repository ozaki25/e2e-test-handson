const dayjs = require('dayjs');

module.exports = {
  title: 'E2E Test Handson',
  themeConfig: {
    domain: 'https://e2e-test-handson.ozaki25.vercel.app',
    repo: 'ozaki25/e2e-test-handson',
    repoLabel: 'GitHub',
    smoothScroll: true,
    sidebar: ['/page0', '/page1', '/page2', '/page3', '/page4'],
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    '@vuepress/last-updated': {
      transformer: (timestamp, lang) => {
        return dayjs(timestamp).format('YYYY/MM/DD');
      },
    },
    '@vuepress/back-to-top': {},
    '@vuepress/medium-zoom': {},
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
    seo: {
      description: () => 'ハンズオン資料',
    },
  },
  head: [['link', { rel: 'manifest', href: '/manifest.json' }]],
};
