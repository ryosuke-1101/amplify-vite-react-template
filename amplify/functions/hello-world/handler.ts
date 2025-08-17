/**
 * Hello World Lambda関数のハンドラー
 * 
 * @description HTTP APIリクエストに対してHello Worldメッセージを返す
 * @param event - Lambda関数のイベントオブジェクト
 * @param context - Lambda関数のコンテキストオブジェクト
 * @returns Promise<APIGatewayProxyResult> - HTTP レスポンス
 * 
 * @example
 * // GET /hello
 * // Response: { "message": "Hello World!", "timestamp": "2024-01-01T00:00:00.000Z" }
 */

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Hello World関数が呼び出されました', { 
    method: event.httpMethod, 
    path: event.path,
    timestamp: new Date().toISOString()
  });

  try {
    // リクエストメソッドによる分岐処理
    switch (event.httpMethod) {
      case 'GET':
        return handleGetRequest(event);
      case 'POST':
        return handlePostRequest(event);
      default:
        return createErrorResponse(405, 'メソッドが許可されていません');
    }
  } catch (error) {
    console.error('Hello World関数でエラーが発生しました:', error);
    return createErrorResponse(500, 'サーバー内部エラーが発生しました');
  }
};

/**
 * GETリクエストの処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<APIGatewayProxyResult>
 */
const handleGetRequest = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queryParams = event.queryStringParameters;
  const userName = queryParams?.name || 'World';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      message: `Hello ${userName}!`,
      timestamp: new Date().toISOString(),
      method: 'GET',
      functionName: process.env.FUNCTION_NAME || 'hello-world'
    })
  };
};

/**
 * POSTリクエストの処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<APIGatewayProxyResult>
 */
const handlePostRequest = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let requestBody;
  
  try {
    requestBody = event.body ? JSON.parse(event.body) : {};
  } catch (parseError) {
    console.error('リクエストボディのパースに失敗しました:', parseError);
    return createErrorResponse(400, 'リクエストボディが無効なJSON形式です');
  }

  const userName = requestBody.name || 'World';
  const customMessage = requestBody.message || 'Hello';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      message: `${customMessage} ${userName}!`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedData: requestBody,
      functionName: process.env.FUNCTION_NAME || 'hello-world'
    })
  };
};

/**
 * エラーレスポンスの生成
 * @param statusCode - HTTPステータスコード
 * @param message - エラーメッセージ
 * @returns APIGatewayProxyResult
 */
const createErrorResponse = (
  statusCode: number, 
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      error: message,
      timestamp: new Date().toISOString(),
      statusCode
    })
  };
};
