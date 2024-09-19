#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { SolanaRadarAPIServerStack } from '../lib/cdk-stack';

const app = new cdk.App();
new SolanaRadarAPIServerStack(app, 'SolanaRadarAPIServerStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});