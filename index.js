"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const siyuan = require("siyuan");
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
    const url = await this.loadData("url");
    if (!url) return;
    this.loadByUrl(url, false);
  }
  onLayoutReady() {
    this.layoutRead = true;
  }
  async loadByUrl(url, save = true) {
    if (save) {
      this.saveData("url", url);
    }
    let moduleSrc = `${url}?t=${Date.now()}`;
    console.log("[url]", url);
    if (url.endsWith("/index.ts")) ;
    Promise.all([
      fetch(url.replace(/\/index\.ts$/, "/plugin.json")).then((r) => r.json()),
      import(moduleSrc)
    ]).then(([pluginJSON, module2]) => {
      console.log("[pluginJSON]", pluginJSON);
      const name = pluginJSON.name;
      const pluginClass = module2.default;
      const pluginName = name || pluginClass.name;
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
  async setViteUrl(url) {
    await this.saveData("url", url);
    this.loadByUrl(url);
  }
}
module.exports = VitePlugin;
//# sourceMappingURL=index.js.map
