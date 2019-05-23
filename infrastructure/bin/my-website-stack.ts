#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/cdk';
import { WebsiteStack } from '../lib/website-stack';

const app = new App();
new WebsiteStack(app, 'MyWebsiteStack', {
  domain: 'example.com',
  assetPath: '../frontend/build'
});
