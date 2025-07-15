import { Response } from 'express';

export const handleError = (err: any, res?: Response) => {
  console.error(err);
  if (res) {
    res.status(500).send('Internal Server Error');
  }
};