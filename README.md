# Q-drop Adventure

[![passing](https://github.com/ytakahashi2020/airdrop_quest/actions/workflows/ci.yml/badge.svg)](https://github.com/ytakahashi2020/airdrop_quest/actions/workflows/ci.yml)

![](./docs/img/title.jpg)

## About Q-drop Adventure

![](./docs/img/map.png)

## Live Demo

## API Info

- **setUp**

  you must create OpenAI API Key.

  [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

- **API Methods**

  | No. | Name                     | method | path                  | Overview                    |
  | :-- | :----------------------- | :----- | :-------------------- | :-------------------------- |
  | 1   | geneate Moster data API  | POST   | /api/ai               | generate Monster status     |
  | 2   | geneate Moster Image API | POST   | /api/ai/generateImage | generate Monster Image data |
  | 2   | mint Metaplex NFT API    | POST   | /api/metaplex         | mint Metaplex NFT           |

  以下の API のみ AWS CDK を使って AWS 上にサーバーレス API としてデプロイしています。  
  ※ 実行には API キーが必要です。

  エンドポイント： **https://aga2m7qtr3.execute-api.ap-northeast-1.amazonaws.com**

  | No. | Name                 | method | path          | Overview                       |
  | :-- | :------------------- | :----- | :------------ | :----------------------------- |
  | 1   | geneate Question API | POST   | /generateQuiz | generate Quiz about MagicBlock |

## Backend Wallet for minting Metaplex NFT

**This key is a development key!!**  
**Please don't use this key on mainnet**

[9Vp31rJaFAbJSvNE3jjuyKAsbEtGefzAJdXeHmcn1TFz](https://explorer.solana.com/address/9Vp31rJaFAbJSvNE3jjuyKAsbEtGefzAJdXeHmcn1TFz?cluster=devnet)

## How to work

- **setUp**

  You must create `.env.local` file & set below values

  ```txt
  NEXT_PUBLIC_OPENAI_API_KEY=""
  NEXT_PUBLIC_AWS_APIGATEWAY_API_KEY=""
  ```

  and you must install modules

  ```bash
  yarn
  ```

- **build frontend**

  ```bash
  yarn build
  ```

- **start frontend**

  ```bash
  yarn dev
  ```
