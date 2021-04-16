#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CoachingAlertStack } from '../lib/coaching-alert-stack';

const app = new cdk.App();
new CoachingAlertStack(app, 'CoachingAlertStack');
