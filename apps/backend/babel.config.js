export default {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: { node: 'current' }
        }
      ],
      '@babel/preset-typescript',
      '@babel/preset-react'
    ]
  };