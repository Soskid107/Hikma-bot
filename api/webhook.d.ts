import { IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
declare global {
    var handlersLoaded: boolean;
    var dbInitialized: boolean;
}
export default function handler(req: IncomingMessage, res: ServerResponse): Promise<void>;
//# sourceMappingURL=webhook.d.ts.map