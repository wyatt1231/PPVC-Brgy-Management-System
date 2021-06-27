import { InvalidDateToDefault } from "../Hooks/useDateParser";
import { PaginationModel } from "../Models/PaginationModel";
import { ResidentModel } from "../Models/ResidentModels";

const CSS = () => {
  return `
    <style>
      body {
        flex-direction: column;
        font-family: Arial;
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

const Header = (logo: string) => {
  return `${CSS()} <header class="header" style="font-size: 9pt;">
  <img src='data:image/png;base64, ${logo}' alt="" class="brand-logo" />
  <div class="document-title">Resident Population Report</div>
  <div class="header-info-group">
    <div class="label">Barangay</div>
    <div class="value">37-D, Davao City</div>
  </div>
</header>`;
};

const Content = (
  resident_data: Array<ResidentModel>,
  filters: PaginationModel
) => {
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
                    <div class="label">Resident Name:</div>
                    <div class="value">${filters?.filters?.name}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Edad:</div>
                    <div class="value">${filters?.filters?.min_age}-${
    filters?.filters?.max_age
  }</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Sekso:</div>
                    <div class="value">${filters?.filters?.gender?.map((g) =>
                      g === "m" ? "Lalaki" : "Babae"
                    )}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Mga Purok:</div>
                    <div class="value">${filters?.filters?.purok?.map(
                      (g) => g
                    )}</div>
                  </div>
                </div>
              </div>
        
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Status</div>
                    <div class="value">${filters?.filters?.sts_pk?.map((s) =>
                      s === "A" ? "Active" : "Not Active"
                    )}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Encoded At</div>
                    <div class="value">${InvalidDateToDefault(
                      filters?.filters?.encoded_from,
                      "All prev. dates"
                    )} -  ${InvalidDateToDefault(
    filters?.filters?.encoded_at,
    "All future dates"
  )}</div>
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

const GenerateResidentTable = (resident_data: Array<ResidentModel>) => {
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
      <td>${InvalidDateToDefault(r.encoded_at, "-")}</td>
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

export default {
  Header,
  Content,
  CSS,
  Footer,
};
