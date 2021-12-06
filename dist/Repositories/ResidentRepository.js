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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useDateParser_1 = require("../Hooks/useDateParser");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const useSearch_1 = require("../Hooks/useSearch");
const useValidator_1 = require("../Hooks/useValidator");
const ResidentReport_1 = __importDefault(require("../PdfTemplates/ResidentReport"));
const puppeteer = require("puppeteer");
const path = require("path");
const addResident = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
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
            if ((0, useValidator_1.isValidPicture)(payload.pic)) {
                const upload_result = yield (0, useFileUploader_1.UploadImage)({
                    base_url: "./Files/Images/",
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
            const resident_payload = Object.assign(Object.assign({}, payload), { user_pk: sql_insert_user.insertedId, encoder_pk: user_pk, birth_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.birth_date), died_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.died_date), resident_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.resident_date) });
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
         kita=@kita,
         educ=@educ,  
         resident_date=@resident_date,  
         died_date=@died_date,  
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateResident = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        if (user_pk !== 1) {
            const user_payload = {
                full_name: `${payload.last_name}, ${payload.first_name}`,
                email: payload.email,
                encoder_pk: payload.user_pk,
            };
            const update_user = yield con.Insert(`UPDATE user SET
        email=@email,
        password=AES_ENCRYPT(@email,@email),
        full_name=@full_name
        where user_pk=@encoder_pk;
        `, user_payload);
        }
        if ((0, useValidator_1.isValidPicture)(payload.pic)) {
            const upload_result = yield (0, useFileUploader_1.UploadImage)({
                base_url: "./Files/Images/",
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
        const resident_payload = Object.assign(Object.assign({}, payload), { encoder_pk: user_pk, birth_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.birth_date), died_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.died_date), resident_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.resident_date) });
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
        house_status=@house_status,     
        voting_precinct=@voting_precinct,  
        house_ownership=@house_ownership,
        kita=@kita,
        educ=@educ,  
        resident_date=@resident_date,  
        died_date=@died_date
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const toggleResidentStatus = (resident_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_edit_resident = yield con.Modify(`UPDATE resident SET
        sts_pk=if(sts_pk = 'A' , 'X', 'A') 
        WHERE resident_pk=@resident_pk;`, {
            resident_pk: resident_pk,
        });
        if (sql_edit_resident > 0) {
            con.Commit();
            return {
                success: true,
                message: "The resident status has been updated successfully",
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getDataTableResident = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`
      SELECT * FROM (SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,IF((SELECT COUNT(*) FROM family WHERE ulo_pamilya=r.resident_pk) > 0 , 'oo','dili' ) AS ulo_pamilya,s.sts_desc,s.sts_color,s.sts_backgroundColor,
      YEAR(NOW()) - YEAR(r.birth_date) - (DATE_FORMAT( NOW(), '%m%d') < DATE_FORMAT(r.birth_date, '%m%d')) AS age
      FROM resident r 
      LEFT JOIN status s ON s.sts_pk = r.sts_pk) tmp
      WHERE 
      concat(first_name,' ',last_name)  LIKE concat('%',@quick_search,'%')
      AND first_name LIKE concat('%',@first_name,'%')
      AND last_name LIKE concat('%',@last_name,'%')
      AND gender IN @gender
      AND sts_pk IN @sts_pk
      AND purok IN @purok
      AND age >= ${(0, useDateParser_1.sqlFilterNumber)(payload.filters.min_age, "age")}
      AND age >= ${(0, useDateParser_1.sqlFilterNumber)(payload.filters.max_age, "age")}
      AND encoded_at >= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.encoded_from, "encoded_at")}
      AND encoded_at <= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.encoded_to, "encoded_at")}
      `, payload);
        const hasMore = data.length > payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : payload.page.begin * payload.page.limit + data.length;
        for (const row of data) {
            row.pic = yield (0, useFileUploader_1.GetUploadedImage)(row.pic);
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getDataTableResidentPdf = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const brand_info = yield con.QuerySingle(`
        SELECT logo FROM brand_logo LIMIT 1
      `, {});
        var base64data = brand_info === null || brand_info === void 0 ? void 0 : brand_info.logo.toString("base64");
        const resident_data = yield con.Query(`
      SELECT * FROM
      (SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,IF((SELECT COUNT(*) FROM family WHERE ulo_pamilya=r.resident_pk) > 0 , 'oo','dili' ) AS ulo_pamilya,s.sts_desc,s.sts_color,s.sts_backgroundColor,
      YEAR(NOW()) - YEAR(r.birth_date) - (DATE_FORMAT( NOW(), '%m%d') < DATE_FORMAT(r.birth_date, '%m%d')) AS age
      FROM resident r 
      LEFT JOIN status s ON s.sts_pk = r.sts_pk) tmp
      WHERE 
      concat(first_name,' ',last_name)  LIKE concat('%',@quick_search,'%')
      AND first_name LIKE concat('%',@first_name,'%')
      AND last_name LIKE concat('%',@last_name,'%')
      AND gender IN @gender
      AND sts_pk IN @sts_pk
      AND purok IN @purok
      AND age >= ${(0, useDateParser_1.sqlFilterNumber)(payload.filters.min_age, "age")}
      AND age >= ${(0, useDateParser_1.sqlFilterNumber)(payload.filters.max_age, "age")}
      AND encoded_at >= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.encoded_from, "encoded_at")}
      AND encoded_at <= ${(0, useDateParser_1.sqlFilterDate)(payload.filters.encoded_to, "encoded_at")}
      ORDER BY ${payload.sort.column} ${payload.sort.direction}
      `, payload.filters);
        var absolutePath = path.resolve("./chromium-browser/win64-884014/chrome-win/chrome.exe");
        console.log(`path --------------`, absolutePath);
        const browser = yield puppeteer.launch({
            args: [
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-sandbox",
            ],
            headless: true,
            ignoreDefaultArgs: ["--disable-extensions"],
            // executablePath: absolutePath,
            // executablePath: "/usr/bin/chromium",
        });
        const page = yield browser.newPage();
        yield page.setContent(`${ResidentReport_1.default.Content(resident_data, payload)}`);
        const pdfBuffer = yield page.pdf({
            format: "A4",
            displayHeaderFooter: true,
            headerTemplate: ResidentReport_1.default.Header(base64data),
            footerTemplate: ResidentReport_1.default.Footer(),
            margin: {
                top: "160px",
                bottom: "40px",
            },
        });
        yield browser.close();
        con.Commit();
        return {
            success: true,
            data: `data:image/png;base64, ` + pdfBuffer.toString("base64"),
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getSingleResident = (resident_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`SELECT r.*,CONCAT(r.first_name,' ',r.last_name) fullname,IF((SELECT count(*) from family where ulo_pamilya=r.resident_pk) > 0 , 'oo','dili' ) as ulo_pamilya,s.sts_desc
      ,(SELECT position FROM barangay_official WHERE official_pk=r.resident_pk) brgy_official_pos
      FROM resident r 
      LEFT JOIN status s ON s.sts_pk = r.sts_pk where r.resident_pk =@resident_pk`, {
            resident_pk: resident_pk,
        });
        data.pic = yield (0, useFileUploader_1.GetUploadedImage)(data.pic);
        data.status = yield con.QuerySingle(`select * from status where sts_pk = @sts_pk;`, {
            sts_pk: data.sts_pk,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const searchResident = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`select resident_pk id, concat(last_name,' ',first_name) label from resident
       ${(0, useSearch_1.GenerateSearch)(search, "concat(last_name,' ',first_name)")}
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
exports.default = {
    addResident,
    updateResident,
    getDataTableResident,
    getSingleResident,
    searchResident,
    toggleResidentStatus,
    getDataTableResidentPdf,
};
//# sourceMappingURL=ResidentRepository.js.map