import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  getEdgeProxyContentUrl,
} from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { JssConfig } from 'lib/config';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (config: JssConfig) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;

  if (config.sitecoreEdgeContextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(config.sitecoreEdgeContextId, config.sitecoreEdgeUrl),
    };
  } else if (config.graphQLEndpoint && config.sitecoreApiKey) {
    // Validate that graphQLEndpoint is a full URL, not just a path
    if (
      !config.graphQLEndpoint.startsWith('http://') &&
      !config.graphQLEndpoint.startsWith('https://')
    ) {
      throw new Error(
        `Invalid GraphQL endpoint '${config.graphQLEndpoint}'. ` +
          `The endpoint must be a full URL (e.g., 'https://your-sitecore-instance.com/sitecore/api/graph/edge'). ` +
          `Verify that 'SITECORE_API_HOST' environment variable or 'layoutServiceHost' property in 'scjssconfig.json' is set. ` +
          `Alternatively, configure 'SITECORE_EDGE_CONTEXT_ID' for XM Cloud Edge Platform.`
      );
    }
    clientConfig = {
      endpoint: config.graphQLEndpoint,
      apiKey: config.sitecoreApiKey,
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId (for XM Cloud Edge Platform), ' +
        'or your graphQLEndpoint (full URL) and sitecoreApiKey. ' +
        'Set SITECORE_EDGE_CONTEXT_ID or SITECORE_API_HOST environment variable.'
    );
  }

  return GraphQLRequestClient.createClientFactory(clientConfig);
};
