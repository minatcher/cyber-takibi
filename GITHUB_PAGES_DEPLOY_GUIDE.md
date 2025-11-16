# GitHub Pages デプロイガイド

## 設定内容

Nuxtプロジェクトを`https://minatcher.github.io/cyber-takibi/`にデプロイするよう最適化されました。

### 変更内容

1. **nuxt.config.js の更新**
   - `router.base: '/cyber-takibi/'` を追加（サブディレクトリでのルーティング対応）
   - `generate.dir: 'docs'` を設定（GitHub Pagesの公開ディレクトリ）
   - favicon パスを絶対パスに変更

2. **.github/workflows/deploy.yml**
   - GitHub Actions を使用した自動デプロイ設定
   - `nuxt-app` ブランチへのプッシュで自動実行
   
3. **package.json**
   - `deploy` スクリプト追加（ローカルテスト用）

4. **.gitignore**
   - `docs/` ディレクトリのコミットを許可

## デプロイ手順

### ローカルでの生成テスト

```bash
cd bonfire-app
yarn install
yarn generate
```

実行後、`docs/` ディレクトリが生成されます。

### GitHub Pages への自動デプロイ

1. 変更をコミット
   ```bash
   git add .
   git commit -m "Set up GitHub Pages deployment"
   ```

2. `nuxt-app` ブランチにプッシュ
   ```bash
   git push origin nuxt-app
   ```

3. GitHub リポジトリの **Settings > Pages** で確認
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`, `/root`

GitHub Actions が自動実行され、`docs/` ディレクトリがビルド・デプロイされます。

## トラブルシューティング

### パスが正しくない場合
`router.base` と `favicon` のパスが一致していることを確認してください。

### スタイルが読み込まれない場合
ブラウザの開発者ツールで確認し、リソースパスが `/cyber-takibi/...` になっているか確認してください。

### キャッシュの問題
GitHub Pages キャッシュをクリアするため、ブラウザで `Ctrl+Shift+Delete` でキャッシュ削除後、再度アクセスしてください。
