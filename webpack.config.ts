import * as path from 'path';
import * as webpack from 'webpack';

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');

const config: webpack.Configuration = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              allowTsInNodeModules: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    contentBase: [DIST_DIR, SRC_DIR],
    https: true,
    port: 9094,
  },
};

export default config;