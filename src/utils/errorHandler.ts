
import { Context } from 'telegraf';

export function handleError(ctx: Context, error: unknown, message: string = 'An unexpected error occurred. Please try again later.') {
  console.error(`❌ Error for user ${ctx.from?.id || 'unknown'} in chat ${ctx.chat?.id || 'unknown'}:`, error);
  
  // Check if it's a network timeout error
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as any).code;
    if (errorCode === 'ETIMEDOUT' || errorCode === 'ECONNRESET' || errorCode === 'ENOTFOUND') {
      console.error('Network timeout detected, this might be a temporary connectivity issue');
      ctx.reply('⚠️ Network timeout detected. Please try again in a moment. This might be a temporary connectivity issue.');
      return;
    }
  }
  
  // Check if it's a Telegram API error
  if (error && typeof error === 'object' && 'description' in error) {
    const description = (error as any).description;
    if (description && description.includes('timeout')) {
      console.error('Telegram API timeout detected');
      ctx.reply('⚠️ Telegram API timeout. Please try again in a moment.');
      return;
    }
  }
  
  // Default error message
  ctx.reply(message);
}
