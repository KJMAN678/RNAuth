### Devin

- [Devin's Machine](https://app.devin.ai/workspace) でリポジトリ追加

#### 1.Git Pull
- そのまま

#### 2.Configure Secrets
```sh
# 環境変数用のファイル作成
$ touch .envrc

# .envrc に下記を入力. xxx は適宜更新

export HOGE=hoge

# 環境変数を読み込む
$ direnv allow
```

- ローカル用
```sh
$ brew install direnv
```
#### 4.Maintain Dependencies
```sh
$ docker compose up -d
$ docker compose down
$ docker compose build
```

#### 5.SetUp Lint
```sh
$ docker compose run --rm frontend npx expo lint
```

#### 6.SetUp Tests
- no tests ran in 0.00s だと Devin の Verify が通らないっぽい
```sh
$ docker compose run --rm frontend npm run test
```

#### 8.SetUp App
```sh
$ http://localhost:8081/ がフロントエンドのURL
```

#### 9.Additional Notes
- 必ず日本語で回答してください
を入力

### OPENAI-API で PR-Review
- [Qodo Merge](https://qodo-merge-docs.qodo.ai/installation/github/)
  - GPT-4.1利用
  - 日本語の回答をするようプロンプト設定
- GitHub の Repository >> Settings >> Secretes and variables >> Actions の Repository secrets の New repository secret を登録
  - OPENAI_KEY という名称で OPENAI API keys の SECRET KEY を登録
    - [OPENAI API keys](https://platform.openai.com/settings/organization/api-keys) 
```sh
--- .github/
           |- workflows/
                        |-- pr_agent.yml
```

### 参考

- [【2025年最新版】Expo/React Nativeの開発環境を構築する ExpoとExpo Routerをセットアップ](https://zenn.dev/arafipro/books/rn-2025-newest-expo-setup/viewer/02_expo-setup)
- [Expo Routerのレイアウトの仕組みを理解し、より実践的なナビゲーションを構築しよう](https://codezine.jp/article/detail/21710)
- [Expo Router notation](https://docs.expo.dev/router/basics/notation/)
- [SecureStoreがWebで動作しない](https://github.com/expo/expo/issues/7744)
- [Metro ES モジュールの解像度#36551 と互換性のないライブラリ  この変更の影響を受ける場合は、Metro 構成で package.json:exports を無効にすることで非互換性を回避できます](https://github.com/expo/expo/discussions/36551)

### Expo Go アプリで接続

- PC と スマホを同じWifiにつなぐ
- 下記コマンド実行でWifiのIPアドレス (xxx.xxx.x.xxx) を確認
```sh
$ ipconfig getifaddr en0
```
- Expo Go に exp://xxx.xxx.x.xxx:8081 を入力

## ファイル構成図

```
RNAuth/
├── README.md                    # プロジェクトドキュメント
├── docker-compose.yml           # Docker環境設定
└── frontend/                    # React Native/Expoアプリケーション
    ├── Dockerfile              # フロントエンドDocker設定
    ├── app.json                # Expo設定ファイル
    ├── package.json            # 依存関係・スクリプト定義
    ├── package-lock.json       # 依存関係バージョン固定
    ├── tsconfig.json          # TypeScript設定
    ├── eslint.config.js       # ESLint設定
    ├── babel.config.js        # Babel設定
    ├── index.ts               # エントリーポイント
    ├── app/                   # ページルーティング (Expo Router)
    │   ├── _layout.tsx        # ルートレイアウト・認証プロバイダー
    │   ├── (auth)/            # 認証関連画面グループ
    │   │   ├── _layout.tsx    # 認証画面レイアウト
    │   │   ├── login.tsx      # ログイン画面
    │   │   ├── signup.tsx     # サインアップ画面
    │   │   └── reset-password.tsx # パスワードリセット画面
    │   ├── (protected)/       # 認証が必要な画面グループ
    │   │   ├── _layout.tsx    # プロテクト画面レイアウト
    │   │   └── profile.tsx    # プロフィール画面
    │   └── (tabs)/           # タブナビゲーション画面グループ
    │       ├── _layout.tsx   # タブレイアウト
    │       ├── index.tsx     # ホーム画面
    │       └── settings.tsx  # 設定画面
    ├── components/           # 再利用可能コンポーネント
    │   └── AuthGuard.tsx    # 認証ガード・未認証時リダイレクト
    ├── contexts/            # React Context
    │   └── AuthContext.tsx  # 認証状態管理・ログイン/ログアウト機能
    ├── utils/               # ユーティリティ関数
    │   ├── auth.ts          # 認証関連バリデーション・設定
    │   └── storage.ts       # SecureStore認証データ永続化
    ├── tests/               # テストファイル
    │   └── sample.test.tsx  # サンプルテスト
    └── assets/              # 画像・アイコンリソース
        ├── adaptive-icon.png # Androidアダプティブアイコン
        ├── favicon.png      # Webファビコン
        ├── icon.png         # アプリアイコン
        └── splash-icon.png  # スプラッシュ画面アイコン
```

### 主要機能
- **認証システム**: ログイン・サインアップ・パスワードリセット
- **セキュアストレージ**: トークンとユーザー情報の暗号化保存
- **ルートガード**: 未認証ユーザーの自動リダイレクト
- **タブナビゲーション**: ホーム・設定画面
- **トークン期限管理**: 5分間の自動ログアウト
