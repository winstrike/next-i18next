import NextI18Next from './types';
import { Middleware } from 'koa';

declare function nextI18NextMiddleware(nexti18next: NextI18Next): Middleware[];

export default nextI18NextMiddleware;
