export default defineAppConfig({
  pages: [
    'pages/sessions/index',
    'pages/income/index',
    'pages/products/index',
    'pages/feedback/index',
    'pages/report/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF9F5',
    navigationBarTitleText: '市集小账本',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFF9F5'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#FF8C42',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/sessions/index',
        text: '场次'
      },
      {
        pagePath: 'pages/income/index',
        text: '收支'
      },
      {
        pagePath: 'pages/products/index',
        text: '商品'
      },
      {
        pagePath: 'pages/feedback/index',
        text: '反馈'
      },
      {
        pagePath: 'pages/report/index',
        text: '报告'
      }
    ]
  }
})