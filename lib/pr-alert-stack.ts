import * as cdk from '@aws-cdk/core';

import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from "@aws-cdk/aws-apigateway";


export class PRAlertStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // our function
    const handler = new lambda.Function(this, "alertHandler", {
      runtime: lambda.Runtime.NODEJS_12_X, 
      code: lambda.Code.fromAsset("resources"),
      handler: "alert.main",
      environment: {
        SLACK_CHANNEL_URL: "{GET_THIS_FROM_YOUR_SLACK_APP}",
        WEBHOOK_SECRET:"{GET_THIS_FROM_YOUR_SLACK_APP}"
      }
    });

    // our API
    const api = new apigateway.RestApi(this, "pr-alert-api", {
      restApiName: "PR Alert Service",
    });
    const postPRAlert = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("POST", postPRAlert); 
  }
}
