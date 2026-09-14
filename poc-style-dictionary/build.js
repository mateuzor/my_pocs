import StyleDictionary from 'style-dictionary';
import config from './config.js';

// Custom format: Style Dictionary is extensible. Here we emit a flat JSON map of name -> value,
// handy for tools (Figma plugins, docs) that don't want CSS or JS.
StyleDictionary.registerFormat({
  name: 'json/flat-names',
  format: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(dictionary.allTokens.map((t) => [t.name, t.$value ?? t.value])), null, 2),
});

// Custom transform: append a unit-less "px" suffix variant for a tool that can't read rem.
StyleDictionary.registerTransform({
  name: 'size/remToPxString',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => `${parseFloat(token.$value) * 16}px`,
});

// 1) Main build from config.js (all platforms)
const sd = new StyleDictionary({
  ...config,
  platforms: {
    ...config.platforms,
    json: {
      transforms: ['attribute/cti', 'name/kebab', 'size/remToPxString', 'color/css'],
      buildPath: 'build/json/',
      files: [{ destination: 'tokens.json', format: 'json/flat-names' }],
    },
  },
});
await sd.hasInitialized;
await sd.buildAllPlatforms();

// 2) Theme build: dark mode only overrides semantic colors. We include the base tokens so that
// references resolve, but filter on isSource so only the overrides reach the output file.
const dark = new StyleDictionary({
  include: ['tokens/color/*.json'],
  source: ['tokens/themes/dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'theme-dark.css',
          format: 'css/variables',
          filter: (token) => token.isSource,
          options: { selector: '[data-theme="dark"]', outputReferences: true },
        },
      ],
    },
  },
});
await dark.hasInitialized;
await dark.buildAllPlatforms();
