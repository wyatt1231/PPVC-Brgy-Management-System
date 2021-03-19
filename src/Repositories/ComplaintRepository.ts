import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { ComplaintLogModel } from "../Models/ComplaintLogModels";
import { ComplaintMessageModel } from "../Models/ComplaintMessageModels";
import { ComplaintModel } from "../Models/ComplaintModels";
import { ResponseModel } from "../Models/ResponseModels";

const addComplaint = async (
  payload: ComplaintModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.reported_by = user_pk;

    const sql_add_complaint = await con.Insert(
      `
        INSERT INTO complaint SET
        reported_by=@reported_by,
        body=@body;
         `,
      payload
    );

    if (sql_add_complaint.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The complaint has been reported successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "No affected rows while reporting the complaint",
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
  payload: ComplaintModel,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.reported_by = user_pk;

    const sql_update_complaint = await con.Modify(
      `
          UPDATE complaint SET
          body=@body
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
  complaint_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: ComplaintModel = await con.QuerySingle(
      `select * from complaint where complaint_pk = @complaint_pk`,
      {
        complaint_pk: complaint_pk,
      }
    );

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
};
