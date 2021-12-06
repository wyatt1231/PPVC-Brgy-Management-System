import { FamilyModel } from "../Models/FamilyModel";
import { PaginationModel } from "../Models/PaginationModel";

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
      .col-12 {
        flex-basis: 100%;
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
  <div class="document-title">Family Report</div>
  <div class="header-info-group">
    <div class="label">Barangay</div>
    <div class="value">37-D, Davao City</div>
  </div>
</header>`;
};

const Content = (
  resident_data: Array<FamilyModel>,
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
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Quick Search:</div>
                    <div class="value">${filters?.filters?.quick_search}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Pangalan sa Ulo sa Pamilya:</div>
                    <div class="value">${
                      filters?.filters?.ulo_pamilya_first_name
                    }</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Apilyedo sa Ulo sa Pamilya:</div>
                    <div class="value">${
                      filters?.filters?.ulo_pamilya_last_name
                    }</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <div class="info-group">
                    <div class="label">Mga Purok:</div>
                    <div class="value">
                    ${filters?.filters?.ulo_fam_purok?.map((g) => g)}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Tinubdan Sa Tubig:</div>
                    <div class="value">
                    ${filters?.filters?.tinubdan_tubig?.map((g) => g)}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Matang sa Kasilyas:</div>
                    <div class="value">
                    ${filters?.filters?.matang_kasilyas?.map((g) => g)}</div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Pasilidad sa Kuryente:</div>
                    <div class="value">${filters?.filters?.pasilidad_kuryente?.map(
                      (g) => g
                    )}</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Matang sa Basura:</div>
                    <div class="value">${filters?.filters?.matang_basura?.map(
                      (g) => g
                    )}</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Tinubdan sa Tubig:</div>
                    <div class="value">${filters?.filters?.tinubdan_tubig?.map(
                      (g) => g
                    )}</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div>
                  <div class="info-group">
                    <div class="label">Biktikma sa Pang-abuso:</div>
                    <div class="value">${filters?.filters?.biktima_pangabuso?.map(
                      (g) => g
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
        
            <div class="info-title">Resident Records</div>
            <table>
              <thead>
                <tr>
                  <td>Ulo sa Pamilya</td>
                  <td>Purok</td>
                  <td>Sakop sa Pamilya</td>
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

const GenerateResidentTable = (resident_data: Array<FamilyModel>) => {
  let table = ``;

  for (const r of resident_data) {
    table =
      table +
      `<tr>
      <td>${r?.ulo_pamilya_info?.first_name} ${r?.ulo_pamilya_info?.middle_name} ${r?.ulo_pamilya_info?.last_name} ${r?.ulo_pamilya_info?.suffix}</td>
      <td>Purok ${r?.ulo_pamilya_info?.purok}</td>
      <td>${r?.fam_members?.length} ka miyembro</td>
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
