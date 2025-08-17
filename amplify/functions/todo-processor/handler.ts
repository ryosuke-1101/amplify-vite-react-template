/**
 * Todo処理Lambda関数のハンドラー
 * 
 * @description TodoアイテムのCRUD操作（作成、読取、更新、削除）を処理する
 * @param event - Lambda関数のイベントオブジェクト
 * @param context - Lambda関数のコンテキストオブジェクト
 * @returns Promise<APIGatewayProxyResult> - HTTP レスポンス
 * 
 * @example
 * // POST /todos - Todoアイテムの作成
 * // Body: { "content": "新しいタスク", "isDone": false }
 * 
 * // GET /todos - 全Todoアイテムの取得
 * 
 * // PUT /todos/{id} - Todoアイテムの更新
 * // Body: { "content": "更新されたタスク", "isDone": true }
 * 
 * // DELETE /todos/{id} - Todoアイテムの削除
 */

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Todo アイテムの型定義
interface TodoItem {
  id?: string;
  content: string;
  isDone: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// レスポンスの型定義
interface TodoResponse {
  success: boolean;
  data?: TodoItem | TodoItem[];
  message?: string;
  error?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Todo処理関数が呼び出されました', { 
    method: event.httpMethod, 
    path: event.path,
    pathParameters: event.pathParameters,
    timestamp: new Date().toISOString()
  });

  try {
    // CORSヘッダーの設定
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // OPTIONSリクエスト（CORS Preflight）の処理
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // リクエストメソッドによる分岐処理
    let result: TodoResponse;
    
    switch (event.httpMethod) {
      case 'GET':
        result = await handleGetTodos(event);
        break;
      case 'POST':
        result = await handleCreateTodo(event);
        break;
      case 'PUT':
        result = await handleUpdateTodo(event);
        break;
      case 'DELETE':
        result = await handleDeleteTodo(event);
        break;
      default:
        return createErrorResponse(405, 'メソッドが許可されていません', corsHeaders);
    }

    return {
      statusCode: result.success ? 200 : 400,
      headers: corsHeaders,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Todo処理関数でエラーが発生しました:', error);
    return createErrorResponse(500, 'サーバー内部エラーが発生しました', {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
  }
};

/**
 * Todoアイテムの取得処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<TodoResponse>
 */
const handleGetTodos = async (event: APIGatewayProxyEvent): Promise<TodoResponse> => {
  try {
    // TODO: 実際のデータベースからの取得処理をここに実装
    // 現在はモックデータを返す
    const mockTodos: TodoItem[] = [
      {
        id: '1',
        content: 'サンプルTodo 1',
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        content: 'サンプルTodo 2',
        isDone: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return {
      success: true,
      data: mockTodos,
      message: 'Todoアイテムの取得に成功しました'
    };
  } catch (error) {
    console.error('Todoアイテムの取得でエラーが発生しました:', error);
    return {
      success: false,
      error: 'Todoアイテムの取得に失敗しました'
    };
  }
};

/**
 * Todoアイテムの作成処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<TodoResponse>
 */
const handleCreateTodo = async (event: APIGatewayProxyEvent): Promise<TodoResponse> => {
  try {
    if (!event.body) {
      return {
        success: false,
        error: 'リクエストボディが必要です'
      };
    }

    const todoData: Partial<TodoItem> = JSON.parse(event.body);
    
    // バリデーション
    if (!todoData.content || typeof todoData.content !== 'string') {
      return {
        success: false,
        error: 'contentフィールドは必須で、文字列である必要があります'
      };
    }

    // TODO: 実際のデータベースへの保存処理をここに実装
    const newTodo: TodoItem = {
      id: generateUniqueId(),
      content: todoData.content,
      isDone: todoData.isDone || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('新しいTodoアイテムを作成しました:', newTodo);

    return {
      success: true,
      data: newTodo,
      message: 'Todoアイテムの作成に成功しました'
    };
  } catch (error) {
    console.error('Todoアイテムの作成でエラーが発生しました:', error);
    return {
      success: false,
      error: 'Todoアイテムの作成に失敗しました'
    };
  }
};

/**
 * Todoアイテムの更新処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<TodoResponse>
 */
const handleUpdateTodo = async (event: APIGatewayProxyEvent): Promise<TodoResponse> => {
  try {
    const todoId = event.pathParameters?.id;
    if (!todoId) {
      return {
        success: false,
        error: 'TodoアイテムのIDが必要です'
      };
    }

    if (!event.body) {
      return {
        success: false,
        error: 'リクエストボディが必要です'
      };
    }

    const updateData: Partial<TodoItem> = JSON.parse(event.body);
    
    // TODO: 実際のデータベースでの更新処理をここに実装
    const updatedTodo: TodoItem = {
      id: todoId,
      content: updateData.content || 'デフォルトコンテンツ',
      isDone: updateData.isDone || false,
      createdAt: '2024-01-01T00:00:00.000Z', // 実際はDBから取得
      updatedAt: new Date().toISOString()
    };

    console.log('Todoアイテムを更新しました:', updatedTodo);

    return {
      success: true,
      data: updatedTodo,
      message: 'Todoアイテムの更新に成功しました'
    };
  } catch (error) {
    console.error('Todoアイテムの更新でエラーが発生しました:', error);
    return {
      success: false,
      error: 'Todoアイテムの更新に失敗しました'
    };
  }
};

/**
 * Todoアイテムの削除処理
 * @param event - APIGatewayProxyEvent
 * @returns Promise<TodoResponse>
 */
const handleDeleteTodo = async (event: APIGatewayProxyEvent): Promise<TodoResponse> => {
  try {
    const todoId = event.pathParameters?.id;
    if (!todoId) {
      return {
        success: false,
        error: 'TodoアイテムのIDが必要です'
      };
    }

    // TODO: 実際のデータベースでの削除処理をここに実装
    console.log('Todoアイテムを削除しました:', todoId);

    return {
      success: true,
      message: `Todoアイテム（ID: ${todoId}）の削除に成功しました`
    };
  } catch (error) {
    console.error('Todoアイテムの削除でエラーが発生しました:', error);
    return {
      success: false,
      error: 'Todoアイテムの削除に失敗しました'
    };
  }
};

/**
 * エラーレスポンスの生成
 * @param statusCode - HTTPステータスコード
 * @param message - エラーメッセージ
 * @param headers - HTTPヘッダー
 * @returns APIGatewayProxyResult
 */
const createErrorResponse = (
  statusCode: number, 
  message: string,
  headers: Record<string, string>
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      statusCode
    })
  };
};

/**
 * ユニークIDの生成
 * @returns string - ユニークなID
 */
const generateUniqueId = (): string => {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
