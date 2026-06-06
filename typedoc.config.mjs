import { OptionDefaults } from 'typedoc';
import pkg from './package.json' with { type: 'json' };

/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
  entryPoints: ['./src/**/*.ts'],
  exclude: ['./src/index.ts', './src/typeguard.ts', './src/internal/*'],
  out: 'docs/api/',
  tsconfig: 'tsconfig.node.json',
  plugin: [
    'typedoc-plugin-mdn-links',
    '@shipgirl/typedoc-plugin-versions',
    'typedoc-plugin-extras'
  ],
  favicon: './docs/favicon.png',

  // typedoc-plugin-extras
  customDescription: pkg.description,

  // @shipgirl/typedoc-plugin-versions
  versions: {
    makeRelativeLinks: true,
    domLocation: 'navigation.begin',
  },

  useTsLinkResolution: true,
  preserveLinkText: true,
  excludeInternal: true,
  jsDocCompatibility: {
    exampleTag: true,
    inheritDocTag: true,
    defaultTag: true
  },

  // Tags
  blockTags: [...OptionDefaults.blockTags, '@note', '@implNote'],
  inlineTags: [...OptionDefaults.inlineTags, '@category'],

  // Code themes
  lightHighlightTheme: 'night-owl-light',
  darkHighlightTheme: 'kanagawa-wave',
}
