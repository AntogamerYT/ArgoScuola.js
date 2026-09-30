import type { Token } from "../types/token.js";
export declare function requestRefreshToken(refreshToken: string): Promise<Token | undefined>;
