import { Construct } from "constructs";
import * as path from "path";
import * as mime from "mime-types";
import { App, TerraformStack, S3Backend, TerraformOutput } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3-bucket";
import { getUIBuildDirectoryPath, getUIBuildFilePaths } from "./utils";
import { S3BucketPolicy } from "@cdktf/provider-aws/lib/s3-bucket-policy";
import { S3BucketWebsiteConfiguration } from "@cdktf/provider-aws/lib/s3-bucket-website-configuration";
import { S3Object } from "@cdktf/provider-aws/lib/s3-object";
import { S3BucketOwnershipControls } from "@cdktf/provider-aws/lib/s3-bucket-ownership-controls";
import { S3BucketPublicAccessBlock } from "@cdktf/provider-aws/lib/s3-bucket-public-access-block";

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

    const webConfig = this.StaticWebsite();

    new TerraformOutput(this, "ui-url", {
      value: `http://${webConfig.websiteEndpoint}`,
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

    new S3BucketPublicAccessBlock(this, "bucket-public-access", {
      bucket: bucket.bucket,
      dependsOn: [bucket],
      blockPublicAcls: false,
    });

    new S3BucketOwnershipControls(this, "bucket-ownership", {
      bucket: bucket.bucket,
      dependsOn: [bucket],
      rule: {
        objectOwnership: "BucketOwnerPreferred",
      },
    });

    const webConfig = new S3BucketWebsiteConfiguration(
      this,
      "bucket-website-config",
      {
        bucket: bucket.bucket,
        dependsOn: [bucket],
        indexDocument: {
          suffix: "index.html",
        },
      }
    );

    new S3BucketPolicy(this, "bucket-policy", {
      bucket: bucket.bucket,
      dependsOn: [bucket],
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
        dependsOn: [bucket],
        key: file.replace(getUIBuildDirectoryPath(), ""),
        bucket: bucket.bucket,
        source: path.resolve(file),
        etag: `${Date.now()}`,
        contentType: mime.contentType(path.extname(file)) || undefined,
      });
    }

    return webConfig;
  }
}

const app = new App();

new ServerlessProjectStack(app, "serverless-project-group-sdp-08");

app.synth();
