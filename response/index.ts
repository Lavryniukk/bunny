import { Exception } from '../errors';

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
    { message: err.message },
    {
      status: err.status,
      headers: HEADERS,
    }
  );
};
