import { parse as parseUrl } from 'url';

export const validateUrl = (url: string): boolean => {
    const parsedUrl = parseUrl(url);

    return (
        Boolean(parsedUrl.protocol && parsedUrl.host) &&
        !url.includes('undefined')
    );
};
