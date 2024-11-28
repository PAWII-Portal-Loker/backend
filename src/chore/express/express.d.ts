type ExpressLocalsKey = "userId" | "roleId" | "deviceId";

declare namespace Express {
  export interface Response {
    setLocals(key: ExpressLocalsKey, value: string | string[]): void;
    getLocals(key: ExpressLocalsKey): string | string[];
  }
}
