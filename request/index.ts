import { BunnyRequestParams } from '../types';

export const parseRequestParams = async (req: Request, routePath: string): Promise<BunnyRequestParams> => {
  const url = new URL(req.url);
  const path = url.pathname;

  const params = parseParams(path, routePath);
  let body = null;

  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      body = null;
    }
  }

  return {
    body,
    params,
  };
};

export const parseParams = (path: string, routePath: string): Record<string, string> => {
  const pathParts = path.split('/');
  const routeParts = routePath.split('/');

  const params: Record<string, string> = {};

  routeParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[i];
    }
  });

  return params;
};
