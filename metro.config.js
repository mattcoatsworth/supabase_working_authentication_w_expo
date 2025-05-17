// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Solution for Supabase 'ws' / 'stream' issue in React Native / Expo
// See: https://github.com/supabase/supabase-js/issues/1258 and https://github.com/expo/expo/issues/26255
config.resolver.unstable_conditionNames = ['browser', 'require', 'default'];
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 