/** @type {import('jest').Config} */

module.exports = {
    ...require('@pulsifi/fn/configs/dev/jest'),
    coverageThreshold: {
        global: {
            functions: 65,
        },
    },
};
