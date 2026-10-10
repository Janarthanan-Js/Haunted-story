
import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input) {
    const sanitizedInput = {};

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string') {
            sanitizedInput[key] = sanitizeHtml(value, {
                allowedTags: ['b'],
                allowedAttributes: {}
            });
        } else {
            sanitizedInput[key] = value;
        }
    }

    return sanitizedInput;
}