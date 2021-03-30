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
const overallPopulation = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        let current_year = moment_1.default().year();
        const years = [];
        const alive_stats = [];
        const death_stats = [];
        for (let i = 0; i < 10; i++) {
            const alive = yield con.QuerySingle(`
      SELECT  COUNT(*) total FROM resident WHERE YEAR(resident_date) = '${current_year}'
      `, null);
            alive_stats.push({
                x: current_year,
                y: alive.total,
            });
            const death = yield con.QuerySingle(`
      SELECT COUNT(*) as total FROM resident WHERE YEAR(died_date) = '${current_year}'
      `, null);
            death_stats.push({
                x: current_year,
                y: death.total,
            });
            years.push(current_year);
            current_year = current_year - 1;
        }
        con.Commit();
        const result_data = {
            labels: years,
            death: death_stats,
            alive: alive_stats,
        };
        return {
            success: true,
            data: result_data,
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
const ageGroupStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const ages = yield con.Query(`
        SELECT * FROM 
        (
        SELECT '0-10' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 0 AND DATEDIFF(DATE(NOW()), birth_date) <=10
        UNION ALL
        SELECT '11-20' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 11 AND DATEDIFF(DATE(NOW()), birth_date) <=20
        UNION ALL
        SELECT '21-30' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 21 AND DATEDIFF(DATE(NOW()), birth_date) <=30
        UNION ALL
        SELECT '31-40' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 31 AND DATEDIFF(DATE(NOW()), birth_date) <=40
        UNION ALL
        SELECT '41-50' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 41 AND DATEDIFF(DATE(NOW()), birth_date) <=50
        UNION ALL
        SELECT '51-60' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 51 AND DATEDIFF(DATE(NOW()), birth_date) <=60
        UNION ALL
        SELECT '61-70' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 61 AND DATEDIFF(DATE(NOW()), birth_date) <=70
        UNION ALL
        SELECT '71-90' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 71 AND DATEDIFF(DATE(NOW()), birth_date) <=80
        UNION ALL
        SELECT '81-90' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 91 AND DATEDIFF(DATE(NOW()), birth_date) <=90
        UNION ALL
        SELECT '100+' AS x, COUNT(*) y FROM resident WHERE DATEDIFF(DATE(NOW()), birth_date) >= 100 AND died_date IS NOT NULL
        ) tmp
          `, null);
        const labels = [];
        for (const r of ages) {
            labels.push(r.x);
        }
        con.Commit();
        return {
            success: true,
            data: {
                labels: labels,
                data_set: ages,
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
const lifeStageStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const life_stage_stats = yield con.Query(`
      SELECT 'infant' AS 'x', COUNT(*) AS 'y' FROM resident WHERE died_date IS NULL AND YEAR(NOW()) - YEAR(birth_date) <= 1
      UNION ALL
      SELECT 'children' AS 'x', COUNT(*) AS 'y'  FROM resident WHERE died_date IS NULL AND YEAR(NOW()) - YEAR(birth_date) > 1 AND YEAR(NOW()) - YEAR(birth_date) < 18  
      UNION ALL
      SELECT 'adult' AS 'x', COUNT(*) AS 'y'  FROM resident WHERE died_date IS NULL AND YEAR(NOW()) - YEAR(birth_date) > 18 AND YEAR(NOW()) - YEAR(birth_date) < 60
      UNION ALL
      SELECT 'senior citizen' AS 'x', COUNT(*) AS 'y'  FROM resident WHERE died_date IS NULL AND YEAR(NOW()) - YEAR(birth_date) >= 60 
          `, null);
        con.Commit();
        return {
            success: true,
            data: {
                labels: ["infant", "children", "adult", "senior citizen"],
                data_set: life_stage_stats,
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
const genderStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const total_male = yield con.QuerySingle(`
      SELECT COUNT(*) AS total FROM resident WHERE died_date IS NOT NULL AND YEAR(resident_date) = YEAR(NOW()) AND gender = 'm'
          `, null);
        const total_female = yield con.QuerySingle(`
      SELECT COUNT(*) AS total FROM resident WHERE died_date IS NOT NULL AND YEAR(resident_date) = YEAR(NOW()) AND gender = 'f'
          `, null);
        con.Commit();
        return {
            success: true,
            data: {
                labels: ["lalaki", "babae"],
                data_set: [
                    {
                        x: "lalaki",
                        y: total_male.total,
                    },
                    {
                        x: "babae",
                        y: total_female.total,
                    },
                ],
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
exports.default = {
    overallPopulation,
    ageGroupStats,
    genderStats,
    lifeStageStats,
};
//# sourceMappingURL=DashboardRepository.js.map