const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   entry: {
      main: './source/index.ts'
   },
   resolve: {
      extensions: ['.ts', '.js']
   },
   optimization: {
      minimize: true,
      minimizer: [
         new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
            terserOptions: {}
         })
      ]
   },
   performance: {
      maxEntrypointSize: 700000
   },
   mode: 'production',
   resolve: { extensions: ['.ts', '.js'] },
   module: {
      rules: [
         {
            test: /\.ts$/,
            use: { loader: 'ts-loader', options: { transpileOnly: true } }
         },
         {
            test: /\.css$/,
            include: /index\.css$/,
            use: [
               'style-loader',
               { loader: 'css-loader', options: { sourceMap: true } },
               'postcss-loader'
            ]
         },
         {
            test: /\.css$/,
            exclude: /index\.css$/,
            use: [
               'to-string-loader',
               { loader: 'css-loader', options: { sourceMap: true } },
               'postcss-loader'
            ]
         },
         {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]',
                     outputPath: 'fonts/',
                     publicPath: 'fonts/'
                  }
               }
            ]
         }
      ]
   },
   plugins: [new HtmlWebpackPlugin({ template: './source/index.html' })]
};
