const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
   entry: {
      main: './source/index.ts'
   },
   resolve: {
      extensions: ['.ts', '.js']
   },
   performance: {
      maxEntrypointSize: 700000
   },
   devServer: {
   },
   mode: 'development',
   devtool: 'inline-source-map',
   resolve: { extensions: ['.ts', '.js'] },
   module: {
      rules: [
         {
            test: /\.ts$/,
            use: {loader: 'ts-loader', options: {transpileOnly: true}}
         },
         {
            test: /\.css$/,
            include: /index\.css$/,
            use: [
               'style-loader',
               {loader: 'css-loader', options: {sourceMap: true}},
               'postcss-loader'
            ]
         },
         {
            test: /\.css$/,
            exclude: /index\.css$/,
            use: [
               'to-string-loader',
               {loader: 'css-loader', options: {sourceMap: true}},
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

//module.exports.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
