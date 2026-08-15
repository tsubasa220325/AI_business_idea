# AI Business Idea Atlas — Export Package

このZIPには、AI事業案100件を比較・検討する静的Webアプリのソースコード、設計メモ、事業案レポートを含めています。

## 起動方法

Node.js 22系とpnpmを利用できる環境で、プロジェクト直下から次を実行します。

```bash
pnpm install
pnpm dev
```

本番用ビルドは、次のコマンドです。

```bash
pnpm build
```

## 主要ファイル

| パス | 内容 |
|---|---|
| `client/src/data/ideas.ts` | 100件のAI活用事業案と評価データ |
| `client/src/pages/Home.tsx` | 検索・絞り込み・比較UI |
| `client/src/index.css` | Midnight Decision Terminalのデザインシステム |
| `ideas.md` | デザイン方針・ブランド方針 |
| `AI活用事業案100_調査レポート.md` | 100案の調査・評価根拠 |

## アセットについて

Webページは、Manusプロジェクトに紐づく管理アセットURLを参照しています。Manus上でこのプロジェクトを継続利用する場合はそのまま有効です。別のホスティング環境へ移行する際は、`client/src/pages/Home.tsx` と `client/index.html` の `/manus-storage/` URLを、移行先にアップロードしたアセットのURLへ差し替えてください。
