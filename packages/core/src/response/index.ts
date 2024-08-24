import { Exception } from '@bunny-ts/common';
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const json = (data: any, init?: ResponseInit): Response => {
  return Response.json(data, {
    ...init,
    headers: HEADERS,
  });
};

export const error = (err: Exception): Response => {
  return Response.json(
    { ...err },
    {
      status: err.status,
      headers: HEADERS,
    }
  );
};
