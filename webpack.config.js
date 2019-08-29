var path = require('path');
var MiniCSSExtractPlugin = require('mini-css-extract-plugin');
//console.log("$$$$$$$ " +path.resolve(__dirname, 'public/dist'));

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /(node_modules|bower_components)/,
                use:
                {
                   loader: 'babel-loader', options: {  presets: ['@babel/preset-react'] }
                }
            },
            { 
                test: /\.scss$/, 
                loader: [
                  MiniCSSExtractPlugin.loader,
                  "css-loader",
                  'sass-loader'
                ]
              }
        ]
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: "./css/estilos.css",
          })
      ]
};