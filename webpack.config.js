var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PurifyCSSPlugin = require('purifycss-webpack');
var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
	entry: {
		app: [
			'./src/main.js',
			'./src/main.scss'
		]
	},

	output: {
		path: path.resolve(__dirname, './dist'), // convert relative path to absolute path
		filename: '[name].js'
	},

	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				//use: ['style-loader', 'css-loader', 'sass-loader'] 	// 1. scss-loader will require to parse scss/sass files
																	// 2. css-loader will require to parse css files
																	// 3. style-loader will require to inject style into the page

				use: ExtractTextPlugin.extract({ // extracting css into dedicated css file
		          fallback: "style-loader",
		          use: ['css-loader', 'sass-loader']
		        })
			},

			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'] 	// 1. css-loader will require to parse css files
														// 2. style-loader will require to inject style into the page
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader" // babel-loader will transform our ECMA script 2015/16 code to vanila javascript to support every browser
			}
		]
	},

	plugins: [
    	new ExtractTextPlugin("[name].css"),

    	// Make sure this is after ExtractTextPlugin!
		new PurifyCSSPlugin({ // strip unused css
			// Give paths to parse for rules. These should be absolute!
			paths: glob.sync(path.join(__dirname, 'index.html')),
			minimize: inProduction
		}),

    	new webpack.LoaderOptionsPlugin({ // minimize css
    		minimize: inProduction
    	})
	]
};

if(inProduction) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin() // minify our js code if node environment is a production
	);
}