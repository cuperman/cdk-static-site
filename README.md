# cdk-static-site

Example static React website in an AWS stack

## Frontend

React application generated from [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started)

Useful commands:

```bash
cd frontend

npm install
npm test
npm start

npm run build
```

## Backend

Placeholder for when the stack becomes more complicated

## Infrastructure

[CDK](https://docs.aws.amazon.com/cdk/api/latest/) code that provisions a stack in [AWS](https://aws.amazon.com/), updates the stack, and deploys frontend code to S3 when executed

Useful commands:

```bash
cd infrastructure

npm install

npm run watch
npm run build

npm run cdk synth
npm run cdk diff
npm run cdk deploy
```
