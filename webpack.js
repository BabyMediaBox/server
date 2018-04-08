let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve (dir) {
    console.log( '=', path.join(__dirname, '..', dir));
    return path.join(__dirname, '..', dir)
}
function cssLoaders(options)
{
    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
        var loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
};
let IS_DEV = true;
let APP_PATH = resolve('./src/client/js');
let SASS_PATH = resolve('./src/client/sass');
let vueLoaderConfig = {
    loaders: cssLoaders({
        sourceMap: true,
        extract: true
    }),
    transformToRequire: {
        video: 'src',
        source: '../../resources/',
        img: 'src',
        image: 'xlink:href'
    }
};

const config = {
    mode: "development",
    entry: {
        kiosk: './src/client/js/kiosk.js',
        remote: './src/client/js/remote.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.scss'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': APP_PATH,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: IS_DEV
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [APP_PATH]
            },

            // STYLES
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: IS_DEV
                        }
                    },
                ]
            },

            {
                test: /\.(scss|sass)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [SASS_PATH]
                    }
                }]
            }
        ]
    }
};

module.exports = config;