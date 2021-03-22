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
        title=@subject,
        body=@body,
        sts_pk="P";
         `,
      payload
    );

    if (sql_add_complaint.insertedId > 0) {
      for (const file of files) {
        const file_res = await UploadFile(
          "src/Storage/Files/Complaints/",
          file
        );

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

    const sql_update_complaint_status = await con.Modify(
      `UPDATE complaint set sts_pk = @sts_pk where complaint_pk = @complaint_pk`,
      payload
    );

    if (sql_update_complaint_status) {
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
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while updating the complaint status",
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

const getComplaintLogTable = async (
  complaint_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    const log_table: Array<ComplaintLogModel> = await con.Query(
      ` SELECT * FROM complaint_log WHERE complaint_pk = @complaint_pk order by encoded_at desc`,
      {
        complaint_pk: complaint_pk,
      }
    );

    for (const log of log_table) {
      log.user = await con.QuerySingle(
        `Select * from vw_users where user_pk = @user_pk`,
        {
          user_pk: log.encoder_pk,
        }
      );

      log.status = await con.QuerySingle(
        `Select * from status where sts_pk = @sts_pk`,
        {
          sts_pk: log.sts_pk,
        }
      );
    }

    return {
      success: true,
      data: log_table,
    };
  } catch (error) {
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

    const data: Array<ComplaintModel> = await con.Query(
      `SELECT complaint_pk,reported_by,DATE_FORMAT(reported_at,'%Y-%m-%d %H:%m %p') AS reported_at,title,body,sts_pk from complaint where complaint_pk = @complaint_pk`,
      {
        complaint_pk: complaint_pk,
      }
    );
      for(var file of data){
        file.complaint_file = await con.Query(
          `
            select * from complaint_file where complaint_pk=@complaint_pk
          `,
          {
            complaint_pk: complaint_pk,
          }
        );
    
        file.user = await con.QuerySingle(
          `Select * from vw_users where user_pk = @user_pk`,
          {
            user_pk: file.reported_by,
          }
        );
        file.user.pic = await GetUploadedImage(
          file.user.pic
        );
      }
  

    // single_complaint.status = await con.QuerySingle(
    //   `Select * from status where sts_pk = @sts_pk;`,
    //   {
    //     sts_pk: single_complaint.sts_pk,
    //   }
    // );

    con.Commit();
    return {
      success: true,
      data:data,
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

    const data: Array<ComplaintModel> = await con.Query(
      `SELECT complaint_pk,reported_by,DATE_FORMAT(reported_at,'%Y-%m-%d %H:%m %p') AS reported_at,title,body,sts_pk FROM complaint where reported_by=@reported_by`,
      {
        reported_by: reported_by,
      }
    );

    for (const complaint of data) {
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

//messages

const addComplaintMessage = async (
  payload: ComplaintMessageModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

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
};const getComplaintList = async (reported_by: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ComplaintModel> = await con.Query(
      `SELECT complaint_pk,reported_by,DATE_FORMAT(reported_at,'%Y-%m-%d %H:%m %p') AS reported_at,title,body,sts_pk FROM complaint where reported_by=@reported_by`,
      {
        reported_by: reported_by,
      }
    );
    for (const file of data) {
      file.complaint_file = await con.Query(
        `
      select * from complaint_file where complaint_file_pk=@complaint_pk
      `,
        {
          complaint_pk: file.complaint_pk,
        }
      );
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
}

const getComplaintMessage = async (
  complaint_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    const table_messages: Array<ComplaintMessageModel> = await con.Query(
      ` SELECT * FROM complaint_message WHERE  complaint_pk =@complaint_pk;`,
      {
        complaint_pk: complaint_pk,
      }
    );

    for (const message of table_messages) {
      message.user = await con.QuerySingle(
        `SELECT * from vw_users where user_pk = @user_pk`,
        {
          user_pk: message.sent_by,
        }
      );
      message.user.pic = await GetUploadedImage(message.user.pic);
    }

    return {
      success: true,
      data: table_messages,
    };
  } catch (error) {
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  getComplaintList,
  addComplaint,
  updateComplaint,
  addComplaintLog,
  addComplaintMessage,
  getSingleComplaint,
  getComplaintTable,
  getComplaintMessage,
  getComplaintLogTable,
};
