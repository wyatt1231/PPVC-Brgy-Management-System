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
const moment_1 = __importDefault(require("moment"));
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const getYearlyPopulationStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        let current_year = moment_1.default().year();
        const yearly_population = [];
        for (let i = 0; i < 20; i++) {
            const current_year_population = yield con.QuerySingle(`SELECT ${current_year} stat_year, (SELECT COUNT(*) FROM resident WHERE YEAR(resident_date) =@current_year) alive, (SELECT COUNT(*) FROM resident WHERE YEAR(died_date) =@current_year) died
        `, {
                current_year: current_year,
            });
            current_year = current_year - 1;
            console.log(`current_year -> `, current_year);
            yearly_population.push(current_year_population);
        }
        con.Commit();
        return {
            success: true,
            data: yearly_population,
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
const getPopulationOfYearStats = (current_year) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_total_population = yield con.QuerySingle(`
        SELECT COUNT(*) as total FROM resident WHERE died_date IS  NULL
        `, {
            current_year: current_year,
        });
        const sql_total_deaths = yield con.QuerySingle(`
          SELECT COUNT(*) as total FROM resident WHERE died_date IS NOT NULL
          `, {
            current_year: current_year,
        });
        const sql_get_male = yield con.QuerySingle(`
        SELECT count(*) as total FROM resident WHERE gender='m' AND died_date IS  NULL AND YEAR(resident_date) =@current_year
          `, {
            current_year: current_year,
        });
        const sql_get_female = yield con.QuerySingle(`
            SELECT count(*) as total FROM resident WHERE gender='f' AND died_date IS  NULL AND YEAR(resident_date) =@current_year
              `, {
            current_year: current_year,
        });
        const sql_get_pwd = yield con.QuerySingle(`
          SELECT COUNT(*) total FROM resident WHERE with_disability ='y'  AND YEAR(resident_date) =@current_year  AND died_date IS  NULL 
                `, {
            current_year: current_year,
        });
        const sql_get_infact = yield con.QuerySingle(`
          SELECT COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date)  <=28  AND YEAR(resident_date) =@current_year  AND died_date IS  NULL
                `, {
            current_year: current_year,
        });
        const sql_get_senior_citizen = yield con.QuerySingle(`
            SELECT COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date)  >= (60*365)  AND YEAR(resident_date) =@current_year  AND died_date IS  NULL
                  `, {
            current_year: current_year,
        });
        const sql_get_children = yield con.QuerySingle(`
            SELECT COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date)  < (18*365)  AND YEAR(resident_date) =@current_year  AND died_date IS  NULL
                  `, {
            current_year: current_year,
        });
        let population_of_year = {
            population: sql_total_population.total,
            deaths: sql_total_deaths.total,
            male: sql_get_male.total,
            female: sql_get_female.total,
            infant: sql_get_infact.total,
            pwd: sql_get_pwd.total,
            senior_citizen: sql_get_senior_citizen.total,
            children: sql_get_children.total,
        };
        con.Commit();
        return {
            success: true,
            data: population_of_year,
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
const getAgeGroupStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const age_range = yield con.Query(`
        SELECT * FROM 
        (
        SELECT '0-10' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 0 AND DATEDIFF(DATE(NOW()), birth_date) <=10
        UNION ALL
        SELECT '11-20' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 11 AND DATEDIFF(DATE(NOW()), birth_date) <=20
        UNION ALL
        SELECT '21-30' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 21 AND DATEDIFF(DATE(NOW()), birth_date) <=30
        UNION ALL
        SELECT '31-40' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 31 AND DATEDIFF(DATE(NOW()), birth_date) <=40
        UNION ALL
        SELECT '41-50' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 41 AND DATEDIFF(DATE(NOW()), birth_date) <=50
        UNION ALL
        SELECT '51-60' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 51 AND DATEDIFF(DATE(NOW()), birth_date) <=60
        UNION ALL
        SELECT '61-70' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 61 AND DATEDIFF(DATE(NOW()), birth_date) <=70
        UNION ALL
        SELECT '71-90' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 71 AND DATEDIFF(DATE(NOW()), birth_date) <=80
        UNION ALL
        SELECT '81-90' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 91 AND DATEDIFF(DATE(NOW()), birth_date) <=90
        UNION ALL
        SELECT '100+' AS age_range, COUNT(*) total FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 100 AND died_date IS NOT NULL
        ) tmp
          `, null);
        con.Commit();
        return {
            success: true,
            data: age_range,
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
    getYearlyPopulationStats,
    getPopulationOfYearStats,
    getAgeGroupStats,
};
//# sourceMappingURL=DashboardRepository.js.map