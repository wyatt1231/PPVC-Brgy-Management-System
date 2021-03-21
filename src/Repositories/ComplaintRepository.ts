import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadFile } from "../Hooks/useFileUploader";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";
import { ComplaintFilesModel, ComplaintModel } from "../Models/ComplaintModels";
import { ResponseModel } from "../Models/ResponseModels";

const addComplaint = async (
  payload: ComplaintModel,
  files: Array<File>
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_add_complaint = await con.Insert(
      `
        INSERT INTO complaint SET
        reported_by=@reported_by,
        title=@title,
        body=@body,
        sts_pk="A";
         `,
      payload
    );

    if (sql_add_complaint.insertedId > 0) {
      for (const file of files) {
        const file_res = await UploadFile(
          "src/Storage/Files/Complaints/",
          file
        );

        console.log(`files_res`, file_res);

        if (!file_res.success) {
          con.Rollback();

          return file_res;
        }

        const news_file_payload: ComplaintFilesModel = {
          file_path: file_res.data.path,
          file_name: file_res.data.name,
          mimetype: file_res.data.mimetype,
          complaint_pk: sql_add_complaint.insertedId,
        };

        const sql_add_news_file = await con.Insert(
          `INSERT INTO complaint_file SET
             complaint_pk=@complaint_pk,
             file_name=@file_name,
             file_path=@file_path,
             mimetype=@mimetype;`,
          news_file_payload
        );

        if (sql_add_news_file.affectedRows < 1) {
          con.Rollback();

          return {
            success: false,
            message:
              "The process has been terminated when trying to save the file!",
          };
        }
      }

      con.Commit();
      return {
        success: true,
        message: "The complaint has been saved successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while saving the complaint",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const updateComplaint = async (
  payload: ComplaintModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_complaint = await con.Modify(
      `
          UPDATE complaint SET
          body=@body,
          title=@title
          where complaint_pk=@complaint_pk;
          ;
           `,
      payload
    );

    if (sql_update_complaint > 0) {
      con.Commit();
      return {
        success: true,
        message: "The complaint has been updated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the complaint",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addComplaintLog = async (
  payload: ComplaintLogModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = user_pk;

    const sql_add_complaint_log = await con.Insert(
      `
              INSERT into complaint_log SET
              complaint_pk=@complaint_pk,
              notes=@notes,
              sts_pk=@sts_pk,
              encoder_pk=@encoder_pk;
               `,
      payload
    );

    if (sql_add_complaint_log.affectedRows > 0) {
      con.Commit();
      return {
        success: true,
        message: "The complaint update has been saved successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while saving the complaint update",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addComplaintMessage = async (
  payload: ComplaintMessageModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.sent_by = user_pk;

    const sql_add_complaint_msg = await con.Insert(
      `
            INSERT into complaint_message SET
            complaint_pk=@complaint_pk,
            body=@body,
            sent_by=@sent_by;
             `,
      payload
    );

    if (sql_add_complaint_msg.affectedRows > 0) {
      con.Commit();
      return {
        success: true,
        message: "The complaint has been updated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the complaint",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleComplaint = async (
  complaint_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const single_complaint: ComplaintModel = await con.QuerySingle(
      `Select * from complaint where complaint_pk = @complaint_pk;`,
      {
        complaint_pk: complaint_pk,
      }
    );

    single_complaint.complaint_file = await con.Query(
      `
        select * from complaint_file where complaint_pk=@complaint_pk
      `,
      {
        complaint_pk: complaint_pk,
      }
    );

    single_complaint.user = await con.QuerySingle(
      `Select * from vw_users where user_pk = @user_pk`,
      {
        user_pk: single_complaint.reported_by,
      }
    );
    single_complaint.user.pic = await GetUploadedImage(
      single_complaint.user.pic
    );

    con.Commit();
    return {
      success: true,
      data: single_complaint,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getComplaintTable = async (
  reported_by: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const complaint_table: Array<ComplaintModel> = await con.Query(
      `Select * from complaint`,
      {
        reported_by: reported_by,
      }
    );

    for (const complaint of complaint_table) {
      complaint.complaint_file = await con.Query(
        `
        select * from complaint_file where complaint_pk=@complaint_pk
      `,
        {
          complaint_pk: complaint.complaint_pk,
        }
      );

      complaint.user = await con.QuerySingle(
        `Select * from vw_users where user_pk = @user_pk`,
        {
          user_pk: complaint.reported_by,
        }
      );
      complaint.user.pic = await GetUploadedImage(complaint.user.pic);
    }

    con.Commit();
    return {
      success: true,
      data: complaint_table,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getComplaintMessage = async (
  complaint_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ComplaintMessageModel> = await con.Query(
      `SELECT * from complaint where complaint_pk=@complaint_pk`,
      {
        complaint_pk: complaint_pk,
      }
    );
    for (const file of data) {
      const sql_get_pic = await con.QuerySingle(
        `SELECT pic FROM resident WHERE user_pk=${file?.sent_by} LIMIT 1`,
        null
      );
      file.user_pic = await GetUploadedImage(sql_get_pic?.pic);
    }

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  addComplaint,
  updateComplaint,
  addComplaintLog,
  addComplaintMessage,
  getSingleComplaint,
  getComplaintTable,
  getComplaintMessage,
};
