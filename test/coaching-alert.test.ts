import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CoachingAlert from '../lib/coaching-alert-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CoachingAlert.CoachingAlertStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
