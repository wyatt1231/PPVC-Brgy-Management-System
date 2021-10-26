"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useDateParser_1 = require("../Hooks/useDateParser");
const CSS = () => {
    return `
    <style>
      body {
        flex-direction: column;
        font-family: Verdana;
        padding: 10pt;
        font-size: 9pt;
      }

      .grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-content: start;
      }

      .grid > div  {
        /* margin: 5pt; */
        /* padding: 5pt; */
      }

      .grid > div > .spacing-10 {
        margin: 10pt;
      }

      .col-1 {
        flex-basis: 8.333%;
        
      }

      .col-2 {
        flex-basis: 16.666%;
        
      }

      .col-4 {
        flex-basis: 25%;
        
      }

      .col-4 {
        flex-basis: 33.333%;
        
      }

      .col-5 {
        flex-basis: 41.666%;
        
      }

      .col-6 {
        flex-basis: 50%;
        
      }

      .header {
        display: grid;
        align-items: start;
        align-content: start;
        justify-content: center;
        justify-items: center;
        width: 100%;
      }

      .header .brand-logo {
        height: 40px;
        width: 40px;
      }

      .header .document-title {
        padding: 5pt 0;
        width: 100%;
        display: flex;
        text-align: center;
        justify-content: center;
        align-content: center;
        font-size: 11pt;
        font-weight: 600;
      }

      .header .header-info-group {
        display: flex;
        align-items: center;
        align-content: center;
        justify-items: start;
        justify-content: start;
      }
      .header .header-info-group .label {
        margin-right: 3pt;
        padding: 1pt;
        font-size: 9pt !important;

      }
      .header .header-info-group .value {
        margin-right: 3pt;
        padding: 1pt;
        font-weight: 600;
        font-size: 9pt !important;
        border-bottom: .05em solid rgba(0, 0, 0, .5);

      }

      .info-title {
        font-weight: 600;
        font-size: 11pt;
        opacity: .8;
        margin: 10pt 0;
      }

      .info-group {
        display: flex;
        padding: 7pt 0;
        justify-content: flex-start;
      }

      .info-group .label {
        margin-right: 5pt;
        flex-grow: auto;
        white-space: nowrap;
        opacity: 0.89;
        font-weight: 500;
      }

      .info-group .value {
        flex-grow: 1;
        font-weight: 400;
        border-bottom: 1px solid rgba(0, 0, 0, .2);
        margin:0  .5em;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 9pt;
      }

      table thead tr {
        text-align: left;
        font-weight: 600;
        background-color: #f5f5f5;
      }

      table th,
      table td {
        padding: 3pt 5pt;
      }

      tbody tr {
        border-bottom: 1pt solid #dddddd;
      }

      footer {
       display: grid;
       justify-content: end;
       justify-items: end;
       align-content: start;
       align-items: start;
       width: 100%;
       margin-right: 20pt;
      }

      .footer-info-group {
        display: grid;
        grid-auto-flow: column;
        font-size: 7pt;
        white-space: nowrap;
        align-content: center;
        align-items: center;
        grid-gap: 5pt;
        
      }

      .footer-info-group .label {
        padding: .3pt 0;
      }

      .footer-info-group .value {
        padding: .3pt 0;
      }



     
    </style>
  `;
};
const Header = (logo) => {
    return `${CSS()} <header class="header" style="font-size: 9pt;">
  <img src='data:image/png;base64, ${logo}' alt="" class="brand-logo" />
  <div class="document-title">Resident Population Report</div>
  <div class="header-info-group">
    <div class="label">Barangay</div>
    <div class="value">37-D, Davao City</div>
  </div>
</header>`;
};
const Content = (resident_data, filters) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return `
        <html>
          <head>
            ${CSS()}
          </head>
        
          <body>
            <div class="info-title">Applied Filters</div>
        
            <div class="grid">
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">First Name:</div>
                    <div class="value">${(_a = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _a === void 0 ? void 0 : _a.first_name}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Last Name:</div>
                    <div class="value">${(_b = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _b === void 0 ? void 0 : _b.last_name}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Edad:</div>
                    <div class="value">${(_c = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _c === void 0 ? void 0 : _c.min_age}-${(_d = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _d === void 0 ? void 0 : _d.max_age}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Sekso:</div>
                    <div class="value">${(_f = (_e = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _e === void 0 ? void 0 : _e.gender) === null || _f === void 0 ? void 0 : _f.map((g) => g === "m" ? "Lalaki" : "Babae")}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Mga Purok:</div>
                    <div class="value">${(_h = (_g = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _g === void 0 ? void 0 : _g.purok) === null || _h === void 0 ? void 0 : _h.map((g) => g)}</div>
                  </div>
                </div>
              </div>
        
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Status</div>
                    <div class="value">${(_k = (_j = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _j === void 0 ? void 0 : _j.sts_pk) === null || _k === void 0 ? void 0 : _k.map((s) => s === "A" ? "Active" : "Not Active")}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Encoded At</div>
                    <div class="value">${(0, useDateParser_1.InvalidDateToDefault)((_l = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _l === void 0 ? void 0 : _l.encoded_from, "All prev. dates")} -  ${(0, useDateParser_1.InvalidDateToDefault)((_m = filters === null || filters === void 0 ? void 0 : filters.filters) === null || _m === void 0 ? void 0 : _m.encoded_at, "All future dates")}</div>
                  </div>
                </div>
              </div>
            </div>
        
            <div class="info-title">Resident Records</div>
            <table>
              <thead>
                <tr>
                  <td >Full Name</td>
                  <td >Sekso</td>
                  <td >Edad</td>
                  <td >Purok</td>
                  <td >Ulo sa Pamilya</td>
                  <td >Encoded At</td>
                </tr>
              </thead>
              <tbody>
                ${GenerateResidentTable(resident_data)}
                
              
              </tbody>
            </table>
        
          
          </body>
        </html>
    `;
};
const GenerateResidentTable = (resident_data) => {
    let table = ``;
    for (const r of resident_data) {
        table =
            table +
                `<tr>
      <td>${r.first_name} ${r.middle_name} ${r.last_name} ${r.suffix}</td>
      <td>${r.gender === "m" ? "Lalaki" : "Babae"}</td>
      <td>${r.age}</td>
      <td>Purok ${r.purok}</td>
      <td>${r.sts_pk === "A" ? "active" : "not active"}</td>
      <td>${(0, useDateParser_1.InvalidDateToDefault)(r.encoded_at, "-")}</td>
    </tr>`;
    }
    return table;
};
const Footer = () => {
    return `${CSS()} <footer>
  <div class="footer-info-group">
  <span class="label">Page </span>
  <span class="value pageNumber"></span>
  </div>
</footer>`;
};
exports.default = {
    Header,
    Content,
    CSS,
    Footer,
};
//# sourceMappingURL=ResidentReport.js.map