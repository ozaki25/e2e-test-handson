const dayjs = require('dayjs');

module.exports = {
  title: 'E2E Test Handson',
  themeConfig: {
    domain: 'https://e2e-test-handson.ozaki25.vercel.app',
    sidebar: [
      {
        title: 'TOP',
        children: ['/'],
      },
      {
        title: 'Subject1',
        children: ['/subject1/page1', '/subject1/page2', '/subject1/page3'],
      },
      {
        title: 'Subject2',
        children: ['/subject2/page1', '/subject2/page2', '/subject2/page3'],
      },
      {
        title: 'Subject3',
        children: ['/subject3/page1', '/subject3/page2', '/subject3/page3'],
      },
    ],
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
    seo: {},
  },
  head: [['link', { rel: 'manifest', href: '/manifest.json' }]],
};
