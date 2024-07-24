"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const siyuan = require("siyuan");
function synchronousFetch(url2, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2, false);
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function() {
      reject(new Error("Request error"));
    };
    xhr.send(JSON.stringify(data));
  });
}
const name = "vite-plugin-siyuan";
const author = "崮生";
const url = "https://github.com/2234839/vite-plugin-siyuan";
const version = "0.0.25";
const minAppVersion = "2.10.3";
const backends = [
  "all"
];
const frontends = [
  "all"
];
const displayName = {
  en_US: "vite-plugin-siyuan",
  zh_CN: "vite-plugin-siyuan"
};
const description = {
  en_US: "",
  zh_CN: ""
};
const readme = {
  en_US: "README.md",
  zh_CN: "README.md"
};
const funding = {
  custom: [
    "https://afdian.com/@llej0"
  ]
};
const pluginJSON = {
  name,
  author,
  url,
  version,
  minAppVersion,
  backends,
  frontends,
  displayName,
  description,
  readme,
  funding
};
const rawRequire = globalThis.require;
globalThis.require = (moduleName) => {
  if (moduleName === "siyuan") {
    return siyuan;
  }
  return rawRequire(moduleName);
};
class VitePlugin extends siyuan.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "layoutRead", false);
  }
  async onload() {
    globalThis.vitePlugin = this;
    const url2 = await synchronousFetch("/api/file/getFile", {
      path: `/data/storage/petal/${pluginJSON.name}/url`
    });
    if (!url2) return;
    this.loadByUrl(url2, false);
  }
  onLayoutReady() {
    this.layoutRead = true;
  }
  async loadByUrl(url2, save = true) {
    if (save) {
      this.saveData("url", url2);
    }
    let moduleSrc = `${url2}?t=${Date.now()}`;
    console.log("[url]", url2);
    if (url2.endsWith("/index.ts")) ;
    Promise.all([
      JSON.parse(await synchronousFetch(url2.replace(/\/index\.ts$/, "/plugin.json"), {})),
      import(moduleSrc)
    ]).then(([pluginJSON2, module2]) => {
      console.log("[pluginJSON]", pluginJSON2);
      const name2 = pluginJSON2.name;
      const pluginClass = module2.default;
      const pluginName = name2 || pluginClass.name;
      const plugin = new pluginClass({
        app: this.app,
        displayName: pluginName,
        name: pluginName,
        i18n: {}
      });
      const oldPlugin = this.app.plugins.find((el) => el.name === pluginName);
      oldPlugin == null ? void 0 : oldPlugin.onunload();
      this.app.plugins.push(plugin);
      plugin.onload();
      if (this.layoutRead) {
        plugin.onLayoutReady();
      }
      console.log("[load plugin]", { module: module2, pluginClass, plugin });
    });
  }
  async setViteUrl(url2) {
    await this.saveData("url", url2);
    this.loadByUrl(url2);
  }
}
module.exports = VitePlugin;
//# sourceMappingURL=index.js.map
