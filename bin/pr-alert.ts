#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PRAlertStack } from '../lib/pr-alert-stack';

const app = new cdk.App();
new PRAlertStack(app, 'PRAlertStack');
