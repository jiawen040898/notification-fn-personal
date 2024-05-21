import { Code, type LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BaseLayer } from '../base/base-layer';

export class LayerGroupResources extends Construct {
    public readonly notificationFnLayer: LayerVersion;
    /**
     * LayerGroupResources
     *
     * @public notificationFnLayer {@link LayerVersion}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.notificationFnLayer = new BaseLayer(
            scope,
            'notification-fn-layer',
            {
                layerVersionName: 'notification-fn-layer',
                description: 'Notification Fn Layer',
                code: Code.fromAsset('layer'),
            },
        );
    }
}
