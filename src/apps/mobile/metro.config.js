const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../../..");
const sharedTypesRoot = path.resolve(monorepoRoot, "src/pkgs/types");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sharedTypesRoot];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
  extraNodeModules: {
    ...(config.resolver.extraNodeModules ?? {}),
    "@raising-atlantic/types": sharedTypesRoot,
  },
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
  ],
};

module.exports = withNativeWind(config, { input: "./global.css" });
