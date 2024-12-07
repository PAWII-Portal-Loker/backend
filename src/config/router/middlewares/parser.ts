import { baseErrorRes } from "@consts";
import { BaseFile } from "@types";
import { StatusBadRequest } from "@consts/statusCodes";
import { NextFunction, Request, Response } from "express";
import * as formidable from "formidable";
import fs from "fs";
import path from "path";

export default function parseFormData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, _, files) => {
    if (err) {
      return throwBadRequests(res, "Error parsing form");
    }

    const uploadedFiles = files["files"];
    if (!uploadedFiles) {
      return throwBadRequests(res, "No files uploaded");
    }

    const arrayedFiles = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];

    const parsedFiles: BaseFile[] = await Promise.all(
      arrayedFiles.map(async (file) => {
        const filePath = file.filepath;
        const content = fs.readFileSync(filePath);
        const extension = path.extname(file.originalFilename || "").slice(1);

        return {
          name: file.originalFilename || "unknown",
          size: file.size,
          type: file.mimetype || "",
          extension: extension,
          content: content,
        };
      }),
    );

    res.locals.parsedFiles = parsedFiles;
    return next();
  });
}

function throwBadRequests(res: Response, msg?: string) {
  const errorRes = Object.assign({}, baseErrorRes, {
    statusCode: StatusBadRequest,
    message: msg ?? "Bad Request",
  });

  res.status(StatusBadRequest).json(errorRes);
}
