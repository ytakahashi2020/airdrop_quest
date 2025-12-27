import * as cdk from 'aws-cdk-lib';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from 'constructs';
import path = require("path");

/**
 * SolanaRadarAPIServerStack
 */
export class SolanaRadarAPIServerStack extends cdk.Stack {
  /**
   * コンストラクター
   * @param scope 
   * @param id 
   * @param props 
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSMから環境変数を取得する。
    const OPENAI_API_KEY = ssm.StringParameter.valueFromLookup(
      this,
      "OPENAI_API_KEY"
    );

    // Lambda関数を定義
    const lambdaFunction = new NodejsFunction(this, "SolanaRadarAPILambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/lambda/index.ts"),
      handler: "handler",
      bundling: {
        forceDockerBundling: true,
        nodeModules: ["hnswlib-node"],
      },
      timeout: cdk.Duration.seconds(600),
      environment: {
        OPENAI_API_KEY: OPENAI_API_KEY
      },
    });

    // S3からファイルを取得するためのポリシー
    const s3ReadPolicy = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: ['arn:aws:s3:::solana-radar-hackathon2024/*'], 
    });

    // Lambda関数にS3アクセス権限を追加
    lambdaFunction.addToRolePolicy(s3ReadPolicy);

    // API Gateway Rest APIを作成
    const api = new apigateway.RestApi(this, "SolanaRadarAPI", {
      restApiName: "generateQuiz",
      description: "SolanaRadarAPILambdaFunction servers my Lambda function.",
    });

    // Lambda Integration
    const postLambdaIntegration = new apigateway.LambdaIntegration(
      lambdaFunction,
      {
        requestTemplates: {
          "application/json": '{ "statusCode": "200" }',
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
          },
        ],
      }
    );

    // APIキーを作成
    const apiKey = api.addApiKey("ApiKey");

    // APIキーを使用するUsagePlanを作成
    const plan = api.addUsagePlan("UsagePlan", {
      name: "Easy",
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    // APIのリソースとメソッドを定義
    const items = api.root.addResource("generateQuiz");
    // CORSの設定を追加
    items.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ["POST", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
      ],
    });

    const postMethod = items.addMethod("POST", postLambdaIntegration, {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    // UsagePlanにメソッドを追加
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: postMethod,
          throttle: {
            rateLimit: 10,
            burstLimit: 2,
          },
        },
      ],
    });
    // UsagePlanにAPIキーを追加
    plan.addApiKey(apiKey);

    // 成果物
    new cdk.CfnOutput(this, "SolanaRadarAPIUrl", {
      value: api.url,
      description: "The URL of the API Gateway",
      exportName: "SolanaRadarAPIUrl",
    });

    new cdk.CfnOutput(this, "SolanaRadarAPILambdaFunctionArn", {
      value: lambdaFunction.functionArn,
      description: "The ARN of the Lambda function",
      exportName: "SolanaRadarAPILambdaFunctionArn",
    });
  }
}
