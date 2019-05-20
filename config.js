console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
const prefix = isProd ? "production.min" : "development";

module.exports = {
  entry: ["@babel/polyfill", "<rootDir>/src/index.js"],
  template: "<rootDir>/public/index.html",
  devServerPort: 8080,
  buildServerPort: 9090,
  publicPath: "/nail/",
  assetsPath: "static/",
  proxyTable: {
    "/data": {
      target: "http://106.14.138.86:7000",
      changeOrigin: true
    }
  },
  alias: {
    "~": "<rootDir>/src",
    "@": "<rootDir>/src/views",
    "#": "<rootDir>/src/assets",
    "&": "<rootDir>/src/models",
    "^": "<rootDir>/src/components"
  },
  eslintExtend: "prettier",
  autoOpenBrowser: true,
  lintOnSave: true,
  pwa: true,
  productionSourceMap: false,
  cdn: {
    prodUrl: "https://cdn.bootcss.com/:name/:version/:path",
    modules: {
      react: [
        {
          name: "react",
          var: "React",
          path: `umd/react.${prefix}.js`
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: `umd/react-dom.${prefix}.js`
        }
      ]
    }
  }
};
