import { JssConfig } from 'lib/config';
import { ConfigPlugin } from '..';

/**
 * This plugin will set computed config props.
 * The "graphQLEndpoint" is an example of making a _computed_ config setting
 * based on other config settings.
 */
class ComputedPlugin implements ConfigPlugin {
  // should come after other plugins (but before fallback)
  order = 10;

  async exec(config: JssConfig) {
    // Only compute graphQLEndpoint if sitecoreApiHost is set and graphQLEndpoint is not already provided
    const computedGraphQLEndpoint =
      config.graphQLEndpoint ||
      (config.sitecoreApiHost && config.graphQLEndpointPath
        ? `${config.sitecoreApiHost}${config.graphQLEndpointPath}`
        : undefined);

    return Object.assign({}, config, {
      graphQLEndpoint: computedGraphQLEndpoint,
    });
  }
}

export const computedPlugin = new ComputedPlugin();
