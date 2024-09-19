# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Public な Docker Image を pull してくる。

```bash
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

## 動かし方

- CDK スタックデプロイ

  ```bash
  yarn deploy '*'
  ```

- CDK スタック削除

  ```bash
  yarn destroy '*'
  ```

## Relayer API の叩き方

```bash
curl -X POST "https://[固有値].execute-api.ap-northeast-1.amazonaws.com/prod/generateQuiz" -H "Content-Type: application/json" -H "x-api-key: [固有値]"
```

以下のように帰ってくる

```json
{
  "content": "{\n  \"question\": \"What is the purpose of Session Keys in MagicBlock?\",\n  \"options\": [\n    \"To create blockchain wallets\",\n    \"To manage leaderboards in games\",\n    \"To improve user experience by eliminating repeated wallet popups\",\n    \"To generate random encryption keys\"\n  ],\n  \"answer\": \"To improve user experience by eliminating repeated wallet popups\"\n}"
}
```
