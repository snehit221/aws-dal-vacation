import { Construct } from "constructs";
import * as path from "path";
import * as mime from "mime-types";
import {
  App,
  TerraformStack,
  S3Backend,
  TerraformOutput,
  TerraformAsset,
  AssetType,
} from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3-bucket";
import {
  LAB_ROLE,
  getLambdaDirectory,
  getUIBuildDirectoryPath,
  getUIBuildFilePaths,
} from "./utils";
import { S3BucketPolicy } from "@cdktf/provider-aws/lib/s3-bucket-policy";
import { S3BucketWebsiteConfiguration } from "@cdktf/provider-aws/lib/s3-bucket-website-configuration";
import { S3Object } from "@cdktf/provider-aws/lib/s3-object";
import { S3BucketOwnershipControls } from "@cdktf/provider-aws/lib/s3-bucket-ownership-controls";
import { S3BucketPublicAccessBlock } from "@cdktf/provider-aws/lib/s3-bucket-public-access-block";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { LambdaFunctionUrl } from "@cdktf/provider-aws/lib/lambda-function-url";
import {
  DynamodbTable,
  DynamodbTableConfig,
} from "@cdktf/provider-aws/lib/dynamodb-table";
import { LambdaPermission } from "@cdktf/provider-aws/lib/lambda-permission";
import { Lexv2ModelsBot } from "@cdktf/provider-aws/lib/lexv2models-bot";
import { Lexv2ModelsIntent } from "@cdktf/provider-aws/lib/lexv2models-intent";
import { Lexv2ModelsBotLocale } from "@cdktf/provider-aws/lib/lexv2models-bot-locale";
import { rooms } from "./utils/data";
import { DynamodbTableItem } from "@cdktf/provider-aws/lib/dynamodb-table-item";

class ServerlessProjectStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here
    new AwsProvider(this, "AWS", {
      region: "us-east-1",
    });

    new S3Backend(this, {
      bucket: "serverless-project-cdktf-state",
      key: "infra",
      region: "us-east-1",
    });

    // this.StaticWebsite();

    // this.HelloWorldLambda();

    this.DynamoDB();

    const lambdas = ["list-rooms", "get-room-by-id"];

    for (const lambda of lambdas) {
      this.Lambda(lambda);
    }
  }

  Lex(lambda: LambdaFunction) {
    console.log(lambda.functionName);
    const bot = new Lexv2ModelsBot(this, "lex-bot", {
      name: "DalvacationHome",
      roleArn: LAB_ROLE,
      idleSessionTtlInSeconds: 300,
      dataPrivacy: [
        {
          childDirected: false,
        },
      ],
    });

    const locale = new Lexv2ModelsBotLocale(this, "lex-bot-locale", {
      dependsOn: [bot],
      botId: bot.id,
      botVersion: "DRAFT",
      localeId: "en_US",
      nLuIntentConfidenceThreshold: 0.7,
    });

    new Lexv2ModelsIntent(this, "lex-navigation-intent", {
      dependsOn: [bot, locale],
      botId: bot.id,
      botVersion: locale.botVersion,
      localeId: locale.localeId,
      name: "Navigation",
      dialogCodeHook: [
        {
          enabled: true,
        },
      ],
      sampleUtterance: [
        {
          utterance: "How to {Destination} ?",
        },
        {
          utterance: "Navigate to {Destination}",
        },
      ],
    });
  }

  DynamoDB() {
    /**
     * refs:
     * - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypeDescriptors
     */
    const defaultTableConf: Partial<DynamodbTableConfig> = {
      billingMode: "PROVISIONED",
      readCapacity: 5,
      writeCapacity: 5,
    };

    const roomsTable = new DynamodbTable(this, "dynamodb-rooms", {
      name: "Rooms",
      hashKey: "id",
      attribute: [
        {
          name: "id",
          type: "S",
        },
      ],
      ...defaultTableConf,
    });

    for (const room of rooms) {
      new DynamodbTableItem(this, `dynamodb-room-item-${room.id}`, {
        dependsOn: [roomsTable],
        tableName: roomsTable.name,
        hashKey: roomsTable.hashKey,
        item: JSON.stringify({
          id: { S: room.id },
          number: { S: room.number },
          image: { S: room.image },
          price: { N: room.price.toString() },
          type: { S: room.type.toString() },
          subtype: { S: room.subtype.toString() },
          available: { BOOL: room.available },
          hotel: { S: room.hotel },
          maxGuests: { N: room.maxGuests.toString() },
          location: { S: room.location },
          amenities: { SS: room.amenities },
        }),
      });
    }

    new DynamodbTable(this, "dynamodb-reservations", {
      name: "Reservations",
      hashKey: "ReferenceCode",
      attribute: [
        {
          name: "ReferenceCode",
          type: "N",
        },
      ],
      ...defaultTableConf,
    });
  }

  StaticWebsite() {
    const BUCKET = "dalvacation-home";

    const bucket = new S3Bucket(this, BUCKET, {
      bucket: BUCKET,
      tags: {
        cdktf: "true",
      },
    });

    const bucketPublicAccessBlock = new S3BucketPublicAccessBlock(
      this,
      "bucket-public-access",
      {
        bucket: bucket.bucket,
        dependsOn: [bucket],
        blockPublicAcls: false,
      }
    );

    const ownershipControls = new S3BucketOwnershipControls(
      this,
      "bucket-ownership",
      {
        bucket: bucket.bucket,
        dependsOn: [bucketPublicAccessBlock],
        rule: {
          objectOwnership: "BucketOwnerPreferred",
        },
      }
    );

    const webConfig = new S3BucketWebsiteConfiguration(
      this,
      "bucket-website-config",
      {
        bucket: bucket.bucket,
        dependsOn: [ownershipControls],
        indexDocument: {
          suffix: "index.html",
        },
      }
    );

    const bucketPolicy = new S3BucketPolicy(this, "bucket-policy", {
      bucket: bucket.bucket,
      dependsOn: [webConfig],
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "Access",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:*"],
            Resource: [`arn:aws:s3:::${BUCKET}`, `arn:aws:s3:::${BUCKET}/*`],
          },
        ],
      }),
    });

    const arrayOfFiles = getUIBuildFilePaths();

    for (const file of arrayOfFiles) {
      new S3Object(this, `${path.basename(file)}`, {
        dependsOn: [bucketPolicy],
        key: file.replace(getUIBuildDirectoryPath(), ""),
        bucket: bucket.bucket,
        source: path.resolve(file),
        etag: `${Date.now()}`,
        contentType: mime.contentType(path.extname(file)) || undefined,
      });
    }

    new TerraformOutput(this, "ui-url", {
      value: `http://${webConfig.websiteEndpoint}`,
    });

    return webConfig;
  }

  LexLambda() {
    const asset = new TerraformAsset(this, "lex-lambda-asset", {
      path: path.resolve(getLambdaDirectory(), "lex"),
      type: AssetType.ARCHIVE,
    });

    const lambda = new LambdaFunction(this, "lex-lambda", {
      functionName: "lex",
      role: LAB_ROLE,
      runtime: "nodejs20.x",
      filename: asset.path,
      handler: "index.handler",
      sourceCodeHash: asset.assetHash,
    });

    new LambdaPermission(this, "lex-lambda-permission", {
      action: "lambda:InvokeFunction",
      functionName: lambda.functionName,
      dependsOn: [lambda],
      principal: "lex.amazonaws.com",
    });

    new LambdaFunctionUrl(this, "lex-lambda-url", {
      authorizationType: "NONE",
      functionName: lambda.functionName,
      dependsOn: [lambda],
      cors: {
        allowOrigins: ["*"],
      },
    });

    return {
      lambda,
    };
  }

  HelloWorldLambda() {
    const asset = new TerraformAsset(this, "hello-world-lambda-asset", {
      path: path.resolve(getLambdaDirectory(), "hello-world"),
      type: AssetType.ARCHIVE,
    });

    const lambda = new LambdaFunction(this, "hello-world-lambda", {
      functionName: "hello-world",
      role: LAB_ROLE,
      runtime: "nodejs20.x",
      filename: asset.path,
      handler: "index.handler",
    });

    new LambdaFunctionUrl(this, "hellow-world-lambda-url", {
      authorizationType: "NONE",
      functionName: lambda.functionName,
      dependsOn: [lambda],
      cors: {
        allowOrigins: ["*"],
      },
    });
  }

  Lambda(name: string) {
    const asset = new TerraformAsset(this, `${name}-lambda-asset`, {
      path: path.resolve(getLambdaDirectory(), name),
      type: AssetType.ARCHIVE,
    });

    const lambda = new LambdaFunction(this, `${name}-lambda`, {
      functionName: name,
      role: LAB_ROLE,
      runtime: "nodejs20.x",
      filename: asset.path,
      handler: "index.handler",
    });

    const url = new LambdaFunctionUrl(this, `${name}-lambda-url`, {
      authorizationType: "NONE",
      functionName: lambda.functionName,
      dependsOn: [lambda],
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["*"],
        allowHeaders: ["*"],
      },
    });

    new TerraformOutput(this, `${name}-lambda-url-display`, {
      value: url.functionUrl,
    });
  }
}

const app = new App();

new ServerlessProjectStack(app, "serverless-project-group-sdp-08");

app.synth();
