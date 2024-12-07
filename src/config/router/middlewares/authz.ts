import { baseErrorRes } from "@consts";
import { StatusUnauthorized } from "@consts/statusCodes";
import { RolesEnum } from "@enums/consts/roles";
import { NextFunction, Request, Response } from "express";

export default function allowedRoles(roles: RolesEnum[]) {
  return (_: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.role;
    const isUserRoleAllowed = roles.some((role) => role === userRole);

    if (!isUserRoleAllowed) {
      const errorRes = Object.assign({}, baseErrorRes, {
        statusCode: StatusUnauthorized,
        message: `Only ${roles.join(", ")} can access this resource`,
      });

      return res.status(StatusUnauthorized).json(errorRes);
    }

    return next();
  };
}
