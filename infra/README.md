# IaC using CDKTF

## Prerequisites

- [Node - version 18.x.x](https://nodejs.org/en/blog/release/v18.20.2)
- [Terraform - version 1.8.x](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [CDKTF - version 0.20.4](https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Configure AWS credentials

```sh
aws configure
# AWS Access Key ID [None]: <value>
# AWS Secret Access Key [None]: <value>
# Default region name [None]: us-east-1
aws configure set aws_session_token <access-token>
```

- Manually create new S3 bucket named `serverless-project-cdktf-state` with default configurations.

> NOTE: You only need to create this bucket once

## Installation

```sh
npm install
```

## Deploy

- Make sure to [build UI](../ui/README.md#build-ui) first.

```sh
cdktf deploy
```

## Destroy

```sh
cdktf destroy
```

## Documentation

Use this documentation to find relevant AWS service and its configuration example - https://github.com/hashicorp/cdktf-aws-cdk/blob/main/docs/API.md
