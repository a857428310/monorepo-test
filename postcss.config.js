const path = require('path')

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'packages-shared/tailwind/tailwind.config.js'),
    },
    autoprefixer: {},
  }
}
