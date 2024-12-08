import { baseErrorRes } from "@consts";
import { StatusTooManyRequests } from "@consts/statusCodes";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const errorResponse = Object.assign({}, baseErrorRes, {
  statusCode: StatusTooManyRequests,
  message: "Too many requests, please try again later.",
});

export default function rateLimitter() {
  const limiter = rateLimit({
    max: 20, // 20 requests
    windowMs: 1000, // per second
    message: errorResponse,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    limiter(req, res, next);
  };
}
