/**
 * @param {import('aws-lambda').LexV2Event} event
 * @param {import('aws-lambda').Context} context
 * @returns {import('aws-lambda').LexV2Result}
 */
const handler = async (event, context) => {
    const intentName = event?.sessionState?.intent?.name;
    switch (intentName) {
        case 'Navigation':
            const navigateToWhere = event.sessionState.intent.slots?.Destination?.value?.interpretedValue?.toLowerCase()?.trim();
            switch (navigateToWhere) {
                case 'login':
                case 'signup':
                    return {
                        sessionState: {
                            dialogAction: {
                                type: 'Close',
                            },
                            intent: {
                                name: intentName,
                                state: 'Fulfilled'
                            }
                        },
                        messages: [
                            {
                                contentType: 'PlainText',
                                content: navigationMessages[navigateToWhere]
                            }
                        ]
                    }
            }
            break;
    }
};

const navigationMessages = {
    login: 'Go to login page, provide user details and click submit.',
    signup: 'Go to signup page, provide user details and click submit.',
    'book room': 'Fist login, Go to room page, Click on Book room. Provide basic details.'
};

exports.handler = handler;
