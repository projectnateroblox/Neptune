import { MonacoTheme } from '../types/types'

export const netThemeDark: MonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  colors: {
    'editor.background': '#011627', // Deep ocean blue
    'editor.foreground': '#d6fffe', // Soft seafoam white
    'editorCursor.foreground': '#00bcd4', // Turquoise wave crest
    'editor.selectionBackground': '#003b4f', // Darker ocean layer
    'editor.lineHighlightBackground': '#002b3b', // Gentle wave motion
    'editorLineNumber.foreground': '#3b8ea5', // Muted teal for readability
    'editor.selectionHighlightBackground': '#005366', // Underwater light diffusion
    'editor.findMatchBackground': '#007e99', // Bright cyan for searching
  },
  rules: [
    // Keywords (like flowing currents)
    { token: 'keyword', foreground: '00eaff', fontStyle: 'bold' }, // Vibrant cyan

    // Variables and Functions (resembling deep coral reefs)
    { token: 'variable', foreground: 'a7c5eb' }, // Soft ocean blue
    { token: 'function', foreground: '00bcd4' }, // Bright wave crests
    { token: 'support.function', foreground: '5fd3bc' }, // Muted teal foam

    // Strings (representing glimmering reflections on the surface)
    { token: 'string', foreground: '39ffcc' }, // Neon green-blue
    { token: 'string.quoted.single', foreground: '33ffbb' },
    { token: 'string.quoted.double', foreground: '33ffbb' },

    // Numbers (resembling the depth gradient of the sea)
    { token: 'number', foreground: '79a6ff' }, // Cool blue depths

    // Comments (gentle wave foam on the surface)
    { token: 'comment', foreground: '3b8ea5', fontStyle: 'italic' }, // Muted seafoam blue

    // Operators (smooth flow between elements)
    { token: 'operator', foreground: '00eaff' }, // Bright cyan accents

    // Special Elements (hidden underwater treasures)
    { token: 'constant.language', foreground: '84ffff', fontStyle: 'bold' }, // Glowing deep-sea light
    { token: 'support.type', foreground: '5fd3bc', fontStyle: 'bold' },
    { token: 'entity.name.function', foreground: '00bcd4' },

    // Additional Depth (for immersive ocean-like feel)
    { token: 'delimiter', foreground: '33bbff' }, // Light azure accents
    { token: 'metatag', foreground: '00eaff' }, // Ocean surface shimmer
    { token: 'support.class', foreground: '79a6ff', fontStyle: 'bold' }, // Mid-depth glow
    { token: 'constant.numeric', foreground: '79a6ff' }, // Ocean depths

    // Fallbacks (maintaining the overall theme)
    { token: 'variable.parameter', foreground: 'a7c5eb' },
    { token: 'keyword.operator', foreground: '00eaff', fontStyle: 'bold' },
    { token: 'function.call', foreground: '5fd3bc' },
  ]
}
