import { dateTimeUtil } from '@pulsifi/fn';
import { Liquid } from 'liquidjs';

export const templateEngine = {
    parseAndRender: async (
        htmlContent: string,
        variables: SafeAny,
    ): Promise<{
        success: boolean;
        content: SafeAny;
        error?: SafeAny;
    }> => {
        const engine = new Liquid();

        const finalVariables = {
            ...variables,
            year: dateTimeUtil.getCurrentYear(),
        };

        let renderOutput;
        try {
            renderOutput = await engine.parseAndRender(
                htmlContent,
                finalVariables,
            );
        } catch (err) {
            return {
                success: false,
                content: htmlContent,
                error: err,
            };
        }
        return {
            success: true,
            content: renderOutput,
        };
    },
};
