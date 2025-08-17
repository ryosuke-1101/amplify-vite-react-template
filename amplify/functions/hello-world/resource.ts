/**
 * Hello World Lambda関数のリソース定義
 * 
 * @description シンプルなHello Worldメッセージを返すLambda関数
 * @author システム管理者
 * @version 1.0.0
 */

import { defineFunction } from '@aws-amplify/backend';

export const helloWorld = defineFunction({
  // 関数名を指定
  name: 'hello-world',
  
  // エントリーポイントとなるハンドラーファイルを指定
  entry: './handler.ts',
  
  // 実行時環境の設定
  runtime: 'nodejs18.x',
  
  // タイムアウト設定（秒）
  timeoutSeconds: 30,
  
  // メモリ設定（MB）
  memoryMB: 512,
  
  // 環境変数の設定（必要に応じて）
  environment: {
    FUNCTION_NAME: 'hello-world',
    NODE_ENV: 'production'
  }
});
