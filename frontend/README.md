## CMSプロジェクト - React, Express, PostgreSQL

このプロジェクトは、Reactをフロントエンドに、Expressをバックエンドに使用したコンテンツ管理システム（CMS）です。データベースにはPostgreSQLを使用しています。認証にはJWT (JSON Web Token) を使い、管理者・ユーザーの役割によるアクセス制御やリッチテキストエディタによる記事の作成・編集機能を提供します。

### 技術スタック

- **フロントエンド**: React.js, JavaScript, HTML, CSS, Material-UI
- **バックエンド**: Node.js, Express.js, JWT (JSON Web Token) 認証
- **データベース**: PostgreSQL
- **開発ツール**: Vite（フロントエンドビルドツール）, Node Package Manager (npm)

### 主な機能

- **ユーザー登録とログイン**: JSON Web Token (JWT) を使用したセキュアな認証
- **記事管理**: 記事の作成、編集、削除。記事はタイトル、本文、カバー画像、カテゴリ情報を持ちます
- **カテゴリ管理**: カテゴリおよびサブカテゴリの作成・編集・削除
- **権限管理**: ユーザー、管理者などの役割に基づいたアクセス権限の制御

---

### プロジェクト構成

#### フロントエンドディレクトリ構造
```
frontend/
├── src/
│   ├── components/         # Reactコンポーネント
│   ├── contexts/           # React Context API（グローバルな状態管理）
│   ├── pages/              # 各ページ（ログイン、記事管理、ダッシュボードなど）
│   ├── assets/             # 静的リソース（CSS、画像など）
│   └── App.js              # アプリケーションのエントリーポイント
├── public/                 # 公開ディレクトリ
└── package.json            # プロジェクト依存関係とスクリプト
```

#### バックエンドディレクトリ構造
```
backend/
├── controllers/            # ルートのロジックを処理するコントローラ
├── models/                 # データベースモデル（PostgreSQLのテーブル構造）
├── routes/                 # APIルート定義
├── middleware/             # 認証やエラーハンドリングのミドルウェア
├── config/                 # 環境変数やデータベースの接続設定
│   └── .env                # 設定ファイル（下記参照）
└── package.json            # プロジェクト依存関係とスクリプト
```

---

### 環境設定ファイル (.env)

以下は `.env` ファイルの設定例です。このファイルにバックエンドの環境変数を設定します。

```bash
POSTGRES_URL="postgres://your-username:your-password@your-hostname:5432/your-dbname"
POSTGRES_USER="your-username"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="your-dbname"
POSTGRES_HOST="your-hostname"
JWT_KEY="your-jwt-secret"        # JWT認証に使用するシークレットキー
ADMIN_USER="admin-name"               # 管理者ユーザー名
ADMIN_PASSWORD="admin-psw"        # 管理者パスワード
```

### 使用方法

#### バックエンド

1. 必要な依存関係をインストール
```bash
cd backend
npm install
```

2. データベースに接続し、サーバーを起動
```bash
npm run dev
```

#### フロントエンド

1. 必要な依存関係をインストール
```bash
cd frontend
npm install
```

2. 開発サーバーを起動
```bash
npm run dev
```

### アクセス方法

フロントエンドは `http://localhost:3000` でアクセス可能です。バックエンドAPIは `http://localhost:5000/api` で動作しています。

### データベースの初期セットアップ

PostgreSQL データベースをローカルまたはリモートに作成し、`.env` ファイルの `POSTGRES_URL` および `POSTGRES_*` 設定を更新してください。
