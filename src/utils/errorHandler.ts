import { Response } from 'express';

export const handleError = (err: any, res?: Response) => {
  console.error(err);
  if (res) {
    res.status(500).send('Internal Server Error');
  }
};

export const handleBotError = (ctx: any, err: any) => {
  console.error(err);
  if (ctx && typeof ctx.reply === 'function') {
    ctx.reply('❌ An unexpected error occurred. Please try again later.');
  }
};