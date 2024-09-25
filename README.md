# Q-drop Adventure

![](./docs/img/cutin.jpeg)

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

  以下の API のみ AWS CDK を使って AWS 上にサーバーレス API としてデプロイしています。  
  ※ 実行には API キーが必要です。

  エンドポイント： **https://aga2m7qtr3.execute-api.ap-northeast-1.amazonaws.com**

  | No. | Name                 | method | path          | Overview                       |
  | :-- | :------------------- | :----- | :------------ | :----------------------------- |
  | 1   | geneate Question API | POST   | /generateQuiz | generate Quiz about MagicBlock |
