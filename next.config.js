const path = require('path')
module.exports = {
  images: {
    domains: ['localhost']
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    CMS_URL: 'http://localhost:1337',
    POST_CMS_ACTIONS: '7359545e168a8feea0c92601fd614c2831c1abbfa15c8e657778a80f2b77443d95632c5e07cdeaa8678f81848394176af3c4175f59dbc4c79cd69a9b4b0bceb959dcc53144aa13fb440cf65eb70791631f375b3d5cc3ac437508e2a5a12a0d2587984a38ef82c7900192c61245d45f19a1168471dbdcdb618c8ecc1c02901cf0',
    CATEGORY_CMS_ACTIONS: '221d6ba242e788a20b588f01ce9058cf6ecbfe46b40e1fb1282751d223a48719d809a83e2e8b3ca82ba6ae8125300356b48aec4d7828b31b95670627a4ea807ca96d4d0c01a0eaad575a8765a64aca869c2a2f09ca3b9eaba9360d6d7d91104abfc9994016642c577214e7ee1ccbf0dd4d36ab4fc36a730e0604e078398394f6',
    OPEN_AI_KEY: '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', 
    PRIVATE_ROUTE_KEY:'JcU9r#car1mOWFwQhL30qP#UwoK7nLHRpoBkH1ub$rC#e8TiEL'
  },
}