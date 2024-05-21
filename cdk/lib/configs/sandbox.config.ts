import type { Construct } from 'constructs';

import type { CommonCDKEnvironmentVariables } from '../interfaces';
import { commonEnvironmentVariables } from './common.config';

export const config = (scope: Construct): CommonCDKEnvironmentVariables => ({
    ...commonEnvironmentVariables(scope),
});
