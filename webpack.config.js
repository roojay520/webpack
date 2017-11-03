// 路径支持
const path = require('path');
// node glob 对象
const glob = require('glob');
// 引 入webpack 内部文件
const webpack = require('webpack');
// css 分离导出插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// js 压缩
const UglifyPlugin = require('uglifyjs-webpack-plugin');
// html 插入
const HtmlPlugin = require('html-webpack-plugin');
// 去掉未使用的 CSS,减少 CSS 冗余
const PurifyCss = require('purifycss-webpack');
// 无需编译打包的静态资源转移
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // 开发调试设置
    devtool: 'eval-source-map',
    // 入口文件
    entry: {
        // js 入口文件
        app: `${__dirname}/main.js`,
        vue: 'vue',
    },
    // 出口文件
    output: {
        // 打包文件路径
        path: `${__dirname}/dist/`,
        filename: 'js/[name].[hash:6].js',
    },
    // 模块
    module: {
        // 编译规则
        rules: [
            // 配置sass编译规则
            {
                // 匹配处理文件的扩展名的正则表达式
                test: /\.(css|scss)$/,
                // 使用模块的名称
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        // options: {
                        // css 压缩与 purifycss-webpack 不能共存
                        // minimize: true,
                        // loader 权重?
                        // importLoaders: 1,
                        // 类名,属性名全部会转换
                        // modules: true,
                        // },
                    },
                        // 前缀自动插入
                    {
                        loader: 'postcss-loader',
                    },
                        // scss 转换
                    {
                        loader: 'sass-loader',
                    },
                    ],
                }),
            },
            // 图片处理
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 将小于 10KB 的图片转换为成 Base64 的格式，写入JS。
                        limit: 10240,
                        outputPath: 'images/',
                    },
                },
            },
            // html 文件中引入 <img> 标签
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader',
            },
            // 配置 babel
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    // 配置文件可以写在 .babelrc里面
                    // options: {
                    //     presets: [
                    //         'env',
                    //     ],
                    // },
                },
                // 匹配正则表达式排除
                exclude: /node_modules/,
            },
        ],
    },
    // 插件
    plugins: [
        // 打包生成 html
        new HtmlPlugin({
            // 开启 html 压缩
            minify: {
                // 去掉属性双引号
                removeAttributeQuotes: true,
            },
            // 避免缓存JS
            // hash: true,
            // html 打包模板文件
            template: './src/index.html',
        }),
        // css 打包分离
        new ExtractTextPlugin('./css/[name].[hash:6].css'),
        // 第三方库引入
        new webpack.ProvidePlugin({
            Vue: 'vue',
        }),
        // 第三方库打包抽离
        new webpack.optimize.CommonsChunkPlugin({
            // 入口引入时的名字
            name: 'vue',
            // 打包文件的路径
            filename: 'static/js/[name].min.js',
            // 最小打包模块
            minChunks: 2,
        }),
        // 去掉未使用的 css
        new PurifyCss({
            // 配置解析规则的路径(绝对路径)
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
            // css 空格压缩
            minimize: true,
        }),
        // js压缩
        new UglifyPlugin({
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false,
                },
                mangle: {
                    keep_fnames: true,
                },
                compress: {
                    drop_console: true,
                },
            },
        }),
        // 无需编译的静态资源转移
        new CopyWebpackPlugin([{
            from: `${__dirname}/src/docs`,
            to: './docs',
        }]),
    ],
    // watch 配置
    watchOptions: {
        // 检测文件修改时间,单位(毫秒)
        poll: 1000,
        // 防止误操作重复打包,半秒内重复保存,不执行打包操作
        aggregeateTimeout: 500,
        ignore: /node_modules/,
    },
    // 开发服务
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '127.0.0.1',
        compress: true,
        port: 4399,
    },
};
