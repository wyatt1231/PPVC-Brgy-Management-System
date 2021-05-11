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
const useValidator_1 = require("../Hooks/useValidator");
const addMobileResident = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user_payload = {
            full_name: `${payload.last_name}, ${payload.first_name}`,
            email: payload.email,
            user_type: "resident",
            encoder_pk: "0",
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
            const resident_payload = Object.assign(Object.assign({}, payload), { user_pk: sql_insert_user.insertedId, birth_date: useDateParser_1.parseInvalidDateToDefault(payload.birth_date) });
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
            console.log(payload.with_disability);
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
const updateMobileResident = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user_payload = {
            full_name: `${payload.last_name}, ${payload.first_name}`,
            email: payload.email,
            encoder_pk: "0",
        };
        console.log(payload);
        const update_user = yield con.Insert(`UPDATE user SET
      email=@email,
      password=AES_ENCRYPT(@email,@email),
      full_name=@full_name
      where user_pk=@encoder_pk;
      `, user_payload);
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
        const resident_payload = Object.assign(Object.assign({}, payload), { encoder_pk: user_pk, birth_date: useDateParser_1.parseInvalidDateToDefault(payload.birth_date) });
        const sql_edit_resident = yield con.Modify(`UPDATE resident SET
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
   
        educ=@educ,
        house_ownership=@house_ownership
        WHERE resident_pk=@resident_pk;`, resident_payload);
        if (sql_edit_resident > 0) {
            const sql_edit_user = yield con.Modify(`UPDATE user SET full_name=CONCAT(@last_name,',',@first_name,' ',@middle_name,' ',@suffix) 
          WHERE user_pk=@user_pk;`, resident_payload);
            if (sql_edit_user > 0) {
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
const getmembers_ulosapamilya = (fam_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(` SELECT  fm.fam_pk,r.first_name,r.middle_name,r.last_name FROM family_member fm JOIN family f ON fm.fam_pk=f.fam_pk JOIN resident r ON f.ulo_pamilya=r.resident_pk  WHERE fm.fam_pk=@fam_pk limit 1`, {
            fam_pk: fam_pk,
        });
        for (const members of data) {
            members.members = yield con.Query(`
        SELECT CONCAT(r.first_name,' ',r.middle_name,' ',r.last_name) fullname,fm.rel FROM family_member fm JOIN resident r ON fm.resident_pk=r.resident_pk JOIN family f ON f.fam_pk=fm.fam_pk WHERE fm.fam_pk=@fam_pk
        `, {
                fam_pk: members.fam_pk,
            });
        }
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
const getmembers = (resident_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    console.log(resident_pk);
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT  fm.fam_pk,r.first_name,r.middle_name,r.last_name FROM family_member fm JOIN resident r ON fm.resident_pk=r.resident_pk WHERE fm.resident_pk=@resident_pk`, {
            resident_pk: resident_pk,
        });
        for (const members of data) {
            members.members = yield con.Query(`
        SELECT CONCAT(r.first_name,' ',r.middle_name,' ',r.last_name) fullname,fm.rel FROM family_member fm JOIN resident r ON fm.resident_pk=r.resident_pk JOIN family f ON f.fam_pk=fm.fam_pk WHERE fm.fam_pk=@fam_pk
        `, {
                fam_pk: members.fam_pk,
            });
        }
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
const getresidents = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    console.log(search);
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM resident WHERE first_name LIKE concat('%',@search,'%') || last_name LIKE concat('%',@search,'%')`, {
            search: search,
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
const getnationality = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM nationality_list`, null);
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
const getreligion = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM religion_list`, null);
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
const updatepassword = (email, password, currentpassword) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const sql_edit_resident = yield con.Modify(`UPDATE user SET password=AES_ENCRYPT(@password,@email) WHERE email=@email AND password=AES_ENCRYPT(@currentpassword,@email)`, {
            email: email,
            password: password,
            currentpassword: currentpassword,
        });
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
const forgotpassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const sql_edit_resident = yield con.Modify(`UPDATE user SET password=AES_ENCRYPT(@password,@email) WHERE email=@email`, {
            email: email,
            password: password,
        });
        console.log(password);
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
const upadatenewuser = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        const sql_edit_resident = yield con.Modify(`UPDATE user SET
         new_user='false'
        WHERE user_pk=@user_pk;`, {
            user_pk: user_pk,
        });
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
exports.default = {
    addMobileResident,
    upadatenewuser,
    getresidents,
    getmembers,
    getmembers_ulosapamilya,
    forgotpassword,
    updatepassword,
    updateMobileResident,
    getreligion,
    getnationality,
};
//# sourceMappingURL=ResidentMobileRepository.js.map