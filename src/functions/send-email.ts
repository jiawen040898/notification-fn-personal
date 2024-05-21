import { ErrorDetails, sqsRecordUtil } from '@pulsifi/fn';
import { Handler, SQSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { IEmailRequest, ITemplateVariable } from '../interface';
import { eventMiddleware } from '../middleware';
import { SendEmailService } from '../services';
import { validateUrl } from '../utils';

const handleEvent: Handler = async (event: SQSEvent) => {
    const dataSource = await getDataSource();
    const sendEmailService = new SendEmailService(dataSource);
    for (const record of event.Records) {
        const emailRequest = sqsRecordUtil.parseBody<IEmailRequest>(record);
        validateEmailTemplateVariableLink(emailRequest.variables);

        await sendEmailService.sendEmail(emailRequest);
    }
};

/** check if any email template variable key end with 'link' or 'url',
 *  if yes and content exist, make sure they are valid url,
 *  prompt error if they are not valid url
 */
export function validateEmailTemplateVariableLink(
    variables: Partial<ITemplateVariable>,
): void {
    for (const key in variables) {
        if (key.endsWith('link') || key.endsWith('url')) {
            const url = variables[key as keyof ITemplateVariable] as string;

            if (url && !validateUrl(url)) {
                throw new EmailVariableValidationException({
                    error_codes: ['invalid_url_format'],
                    key,
                    url,
                });
            }
        }
    }
}

class EmailVariableValidationException extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(`Invalid URL format for variable key: ${errorDetails.key}`);
        this.errorDetails = errorDetails;
    }
}

export const handler = eventMiddleware(handleEvent);
