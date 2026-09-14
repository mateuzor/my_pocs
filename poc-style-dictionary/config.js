// Style Dictionary reads token JSON (source), runs transforms per platform
// (e.g. hex -> UIColor, rem -> dp) and writes files with a format.
// One source of truth, many outputs: this is the whole point of design tokens.
const base = ['tokens/color/*.json', 'tokens/size/*.json', 'tokens/font/*.json'];

export default {
  source: base,
  // The DTCG-style `$value`/`$type` keys are understood natively in v4.
  platforms: {
    css: {
      // A transformGroup is a preset list of transforms: names become kebab-case, etc.
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          // outputReferences keeps `var(--color-palette-indigo-500)` instead of flattening the hex,
          // so overriding one primitive cascades to every semantic token that uses it.
          options: { outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [
        { destination: 'StyleDictionary.swift', format: 'ios-swift/class.swift', options: { className: 'DesignTokens' } },
      ],
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/resources',
          // Filters split one token set into several files, here Android wants colors apart from dimens.
          filter: (token) => token.$type === 'color',
        },
        {
          destination: 'dimens.xml',
          format: 'android/resources',
          filter: (token) => token.$type === 'dimension',
        },
      ],
    },
  },
};
