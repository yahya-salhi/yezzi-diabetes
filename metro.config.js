const path = require("path");
const fs = require("fs");

const REVENUECAT_SCOPES = [
  "@revenuecat/purchases-typescript-internal",
  "@revenuecat/purchases-js-hybrid-mappings",
];

function resolveFile(basePath) {
  const jsPath = basePath + ".js";
  if (fs.existsSync(jsPath)) {
    return fs.realpathSync(jsPath);
  }
  const indexPath = path.join(basePath, "index.js");
  if (fs.existsSync(indexPath)) {
    return fs.realpathSync(indexPath);
  }
  return null;
}

function resolveRevenueCatImport(moduleName) {
  const basePath = path.resolve(__dirname, "node_modules", moduleName);
  const resolved = resolveFile(basePath);
  if (resolved) {
    return { type: "sourceFile", filePath: resolved };
  }
  const pkgJsonPath = path.join(basePath, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const mainEntry = pkg.main || "index.js";
    const mainPath = path.resolve(basePath, mainEntry);
    if (fs.existsSync(mainPath)) {
      return { type: "sourceFile", filePath: fs.realpathSync(mainPath) };
    }
  }
  return null;
}

module.exports = {
  resolver: {
    resolverMainFields: ["react-native", "browser", "main"],
    resolveRequest: (context, moduleName, platform) => {
      for (const scope of REVENUECAT_SCOPES) {
        if (moduleName.startsWith(scope)) {
          const result = resolveRevenueCatImport(moduleName);
          if (result) {
            return result;
          }
          break;
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};
