import fs from "fs";
import { unlink } from "fs/promises";
import moment from "moment";
import { ResponseModel } from "../Models/ResponseModels";

// import { unlink } from "fs/promises";
export interface UploadImageParam {
  base_url: string;
  file_name: string | number;
  extension: "jpg" | "png";
  file_to_upload: string;
}

export const UploadImage = ({
  base_url,
  file_name,
  extension,
  file_to_upload,
}: UploadImageParam): Promise<ResponseModel> => {
  const extended_file_name = `${file_name}-${moment(new Date()).format(
    "x"
  )}.${extension}`;
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(base_url)) {
      fs.mkdirSync(base_url, { recursive: true });
    }
    fs.writeFile(
      base_url + extended_file_name,
      file_to_upload,
      "base64",
      function (err) {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
        } else {
          resolve({
            success: true,
            data: base_url + extended_file_name,
          });
        }
      }
    );
  });
};

export const RemoveImage = async (base_url: string): Promise<ResponseModel> => {
  try {
    await unlink(base_url);
    return {
      success: true,
      message: "Image has been removed",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetUploadedImage = async (url: string): Promise<string | null> => {
  if (typeof url === "string") {
    try {
      const file = await fs.promises.readFile(url, { encoding: "base64" });
      return file;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const UploadFile = (
  base_url: string,
  file_to_upload: any
): Promise<ResponseModel> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(base_url)) {
      fs.mkdirSync(base_url, { recursive: true });
    }

    const file_name = moment(new Date()).format("x") + file_to_upload.name;
    fs.writeFile(
      "./" + base_url + file_name,
      file_to_upload.data,
      function (err) {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
        } else {
          resolve({
            success: true,
            data: {
              path: base_url + file_name,
              name: file_to_upload.name,
              mimetype: file_to_upload.mimetype,
            },
          });
        }
      }
    );
  });
};
