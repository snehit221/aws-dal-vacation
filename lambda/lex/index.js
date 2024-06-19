/**
 * @param {import('aws-lambda').LambdaFunctionURLEvent} event
 * @param {import('aws-lambda').Context} context
 * @returns
 */
const handler = async (event, context) => {
    console.log(event);
};

exports.handler = handler;
