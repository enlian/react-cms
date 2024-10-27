## CMSプロジェクト - React, Express, PostgreSQL, Material-UI

このプロジェクトは、Reactをフロントエンドに、Expressをバックエンドに使用したコンテンツ管理システム（CMS）です。データベースにはPostgreSQLを使用しており、セキュアな認証にはJWT (JSON Web Token) を導入しています。管理者およびユーザーの役割を区別したアクセス制御、記事の作成・編集・削除など、コンテンツ管理の基本機能を提供しています。

### Screenshots

<img src="./frontend/screenshot/1.png" width="400"/><br/>
<img src="./frontend/screenshot/2.png" width="400"/><br/><br/>
<img src="./frontend/screenshot/3.png" width="400"/><br/><br/>
<img src="./frontend/screenshot/4.png" width="400"/><br/><br/>

### 技術スタック

- **フロントエンド**: React.js, TypeScript, HTML, CSS, Material-UI
- **バックエンド**: Node.js, Express.js, JWT (JSON Web Token) 認証
- **データベース**: PostgreSQL
- **開発ツール**: Vite（フロントエンドビルドツール）, Node Package Manager (npm)



### 主な機能

1. **ユーザー登録とログイン**
   - JSON Web Token (JWT) 認証を使用したセキュアなユーザー認証システム。
   - 新規ユーザーの登録と既存ユーザーのログインが可能。

2. **記事管理**
   - リッチテキストエディタを使用した記事の作成、編集、削除が可能。
   - 記事にはタイトル、本文、カバー画像、カテゴリ情報を含む。

3. **カテゴリ管理**
   - カテゴリおよびサブカテゴリの作成、編集、削除が可能。
   - カテゴリを整理して、記事を適切なカテゴリに分類。

4. **記事のカテゴリへのマウント**
   - 記事を特定のカテゴリまたはサブカテゴリにマウント（関連付け）し、コンテンツの構成を管理。

5. **認証と権限管理**
   - 管理者と一般ユーザーの役割を区別し、権限に応じた操作を制限。
   - 管理者のみが記事の作成やカテゴリの編集を行えるように制御。



### プロジェクト構成

#### フロントエンドディレクトリ構造

```
frontend/
├── src/
│   ├── components/         # Reactコンポーネント
│   ├── contexts/           # グローバルな状態管理（React Context API）
│   ├── pages/              # 各ページ（ログイン、記事管理、ダッシュボードなど）
│   ├── assets/             # 静的リソース（CSS、画像など）
│   └── App.js              # アプリケーションのエントリーポイント
├── public/                 # 公開ディレクトリ
└── package.json            # プロジェクト依存関係とスクリプト
```

#### バックエンドディレクトリ構造

```
backend/
├── controllers/            # ルートロジックを処理するコントローラ
├── models/                 # データベースモデル（PostgreSQLテーブル構造）
├── routes/                 # APIルート定義
├── middleware/             # 認証やエラーハンドリングのミドルウェア
├── config/                 # 環境変数やデータベースの接続設定
│   └── .env                # 設定ファイル（下記参照）
└── package.json            # プロジェクト依存関係とスクリプト
```



### 環境設定ファイル (.env)

以下は `.env` ファイルの設定例です。このファイルにバックエンドの環境変数を設定します。

```bash
POSTGRES_URL="postgres://your-username:your-password@your-hostname:5432/your-dbname"
POSTGRES_USER="your-username"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="your-dbname"
POSTGRES_HOST="your-hostname"
JWT_KEY="your-jwt-secret"        # JWT認証に使用するシークレットキー
ADMIN_USER="admin"               # 管理者ユーザー名
ADMIN_PASSWORD="admin123"        # 管理者パスワード
```



### 使用方法

#### バックエンド

1. 必要な依存関係をインストール：
```bash
cd backend
npm install
```

2. データベースに接続し、サーバーを起動：
```bash
npm run dev
```

#### フロントエンド

1. 必要な依存関係をインストール：
```bash
cd frontend
npm install
```

2. 開発サーバーを起動：
```bash
npm run dev
```



### アクセス方法

フロントエンドは `http://localhost:3000` でアクセス可能です。バックエンドAPIは `http://localhost:5000/api` で動作しています。



### データベースの初期セットアップ

PostgreSQL データベースをローカルまたはリモートに作成し、`.env` ファイルの `POSTGRES_URL` および `POSTGRES_*` 設定を更新してください。
