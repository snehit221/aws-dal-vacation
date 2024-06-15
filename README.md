### Setup infrastructure

- Follow documentation in [infra](./infra/README.md)
- Once everything is setup, you can run below command to deploy and destroy your AWS infrastructure.

```sh
make deploy
```

```sh
make destroy
```

### Lambdas

- Write your lambda functions inside dedicated folder `<your-lambda-name>`. Add `index.<any-programming-language>` file inside that folder that contains the logic.
- Write Deployment CDKTF definition for that lambda. Here is [example](https://git.cs.dal.ca/sarvaiya/serverless-project/-/commit/d2b83d63eda5fd6824df6b41b9f95cea88ada46f)

### UI

- UI code is written in `ui` folder using React.
- It is deployed to S3 as static website. You can either run it in your local or deploy (read `infra/README.md`).
