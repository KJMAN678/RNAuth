// Metro の exports バグを回避する設定 (RN 0.79 系)
// 詳細: RN 0.79 以降で "exports" 解決が失敗するケースがあるため、
// unstable_enablePackageExports を無効化します。

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// “exports” 解決を無効化
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
