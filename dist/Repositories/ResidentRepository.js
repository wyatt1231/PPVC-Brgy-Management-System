"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useDateParser_1 = require("../Hooks/useDateParser");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const useSearch_1 = require("../Hooks/useSearch");
const useValidator_1 = require("../Hooks/useValidator");
const addResident = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user_payload = {
            full_name: `${payload.last_name}, ${payload.first_name}`,
            email: payload.email,
            user_type: "resident",
            encoder_pk: user_pk,
        };
        const sql_insert_user = yield con.Insert(`INSERT user SET
      email=@email,
      password=AES_ENCRYPT(@email,@email),
      user_type=@user_type,
      full_name=@full_name,
      encoder_pk=@encoder_pk;
      `, user_payload);
        if (sql_insert_user.insertedId > 0) {
            if (useValidator_1.isValidPicture(payload.pic)) {
                const upload_result = yield useFileUploader_1.UploadImage({
                    base_url: "./src/Storage/Files/Images/",
                    extension: "jpg",
                    file_name: sql_insert_user.insertedId,
                    file_to_upload: payload.pic,
                });
                if (upload_result.success) {
                    payload.pic = upload_result.data;
                }
                else {
                    return upload_result;
                }
            }
            const resident_payload = Object.assign(Object.assign({}, payload), { user_pk: sql_insert_user.insertedId, encoder_pk: user_pk, birth_date: useDateParser_1.parseInvalidDateToDefault(payload.birth_date) });
            const sql_add_resident = yield con.Insert(`INSERT INTO resident SET
         user_pk=@user_pk,
         pic=@pic,              
         first_name=@first_name,       
         middle_name=@middle_name,      
         last_name=@last_name,        
         suffix=@suffix,           
         gender=@gender,           
         birth_date=@birth_date,       
         nationality=@nationality,      
         religion=@religion,         
         civil_status=@civil_status,  
         purok=@purok,   
         phone=@phone,    
         email=@email,  
         dialect=@dialect,          
         tribe=@tribe,            
         with_disability=@with_disability,  
         is_employed=@is_employed,      
         employment=@employment,       
         house_income=@house_income,     
         house_status=@house_status,     
         voting_precinct=@voting_precinct,  
         house_ownership=@house_ownership,  
         sts_pk='A',
         encoder_pk=@encoder_pk;`, resident_payload);
            if (sql_add_resident.insertedId > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "The resident has been added successfully",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "No affected rows while adding the resident",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while adding the user",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const updateResident = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (useValidator_1.isValidPicture(payload.pic)) {
            const upload_result = yield useFileUploader_1.UploadImage({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: payload.user_pk,
                file_to_upload: payload.pic,
            });
            if (upload_result.success) {
                payload.pic = upload_result.data;
            }
            else {
                return upload_result;
            }
        }
        const resident_payload = Object.assign(Object.assign({}, payload), { encoder_pk: user_pk });
        const sql_edit_resident = yield con.Modify(`UPDATE resident SET
        first_name=@first_name,       
        middle_name=@middle_name,      
        last_name=@last_name,        
        prefix=@prefix,           
        gender=@gender,           
        birth_date=@birth_date,       
        nationality=@nationality,      
        religion=@religion,         
        civil_status=@civil_status,  
        dialect=@dialect,          
        tribe=@tribe,  
        with_disability=@with_disability,  

        purok=@purok,   
        phone=@phone,    
        email=@email,  
        voting_precinct=@voting_precinct,  

        is_employed=@is_employed,      
        employment=@employment,       
        house_income=@house_income,     
        house_status=@house_status,     
        house_ownership=@house_ownership,  
        encoder_pk=@encoder_pk
        WHERE resident_pk=@resident_pk;`, resident_payload);
        if (sql_edit_resident > 0) {
            con.Commit();
            return {
                success: true,
                message: "The resident has been updated successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "No affected rows while updating the resident",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getDataTableResident = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`
      SELECT * FROM (SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,s.sts_desc,s.sts_color,s.sts_backgroundColor  FROM resident r 
      LEFT JOIN status s ON s.sts_pk = r.sts_pk) tmp
      WHERE 
      first_name like concat('%',@search,'%')
      OR last_name like concat('%',@search,'%')
      OR fullname like concat('%',@search,'%')
      OR civil_status like concat('%',@search,'%')
      OR religion like concat('%',@search,'%')
      OR nationality like concat('%',@search,'%')
      OR phone like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR sts_desc like concat('%',@search,'%')
      `, payload);
        const hasMore = data.length > payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : payload.page.begin * payload.page.limit + data.length;
        for (const row of data) {
            row.pic = yield useFileUploader_1.GetUploadedImage(row.pic);
        }
        con.Commit();
        return {
            success: true,
            data: {
                table: data,
                begin: payload.page.begin,
                count: count,
                limit: payload.page.limit,
            },
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleResident = (resident_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,s.sts_desc  FROM resident a 
      LEFT JOIN status s ON s.sts_pk = a.sts_pk where r.resident_pk =@resident_pk`, {
            resident_pk: resident_pk,
        });
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const searchResident = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`select resident_pk id, concat(last_name,' ',first_name) label from resident
       ${useSearch_1.GenerateSearch(search, "concat(last_name,' ',first_name)")}
      `, {
            search,
        });
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    addResident,
    updateResident,
    getDataTableResident,
    getSingleResident,
    searchResident,
};
//# sourceMappingURL=ResidentRepository.js.map