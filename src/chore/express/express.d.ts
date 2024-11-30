type ExpressLocalsKey = "userId" | "role" | "deviceId";

declare namespace Express {
  export interface Response {
    setLocals(key: ExpressLocalsKey, value: string | string[]): void;
    getLocals(key: ExpressLocalsKey): string;
  }
}
