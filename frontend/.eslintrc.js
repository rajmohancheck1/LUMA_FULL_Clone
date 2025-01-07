module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['error', 'warn'] }]
  }
}; 