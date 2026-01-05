import {
  calculateFormula,
  calculateTotal,
  currency,
  escapeHtml,
  VAT_RATE,
} from "@/constant";
import type { Column, QuotationItem } from "@/types";

interface InvoiceItem {
  id: number;
  [key: string]: string | number;
}

interface InvoiceHTMLProps {
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  customerCompany: string;
  contactNumber: string;
  customerEmail: string;
  customerAddress: string;
  items: QuotationItem[];
  columns: Column[];
  currencyCode: string;
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice Template</title>
    <style>
      body {
        font-family: monospace;
        line-height: 20px;
        position: relative;
      }
      .text-center {
        text-align: center;
      }
      .text-right {
        text-align: right;
      }
      .font-bold {
        font-weight: bold;
      }
      .capitalize {
        text-transform: uppercase;
      }
      .space-y-2 > :not(:last-child) {
        margin-top: 20px; /* space above */
        margin-bottom: 20px; /* space below */
      }
      p {
        margin: 0%;
      }
      .muted {
        color: #737373;
      }
      .flex p {
        width: 100%;
        display: table;
      }
      .flex {
        width: 100%;
        display: table;
      }
      hr {
        border: none;
        border-top: 1px solid #cdced1; /* line color */
      }
      .header-left {
        display: table-cell;
        vertical-align: top;
        width: 70%;
      }
      .header-right {
        display: table-cell;
        vertical-align: top;
        width: 30%;
      }
      .left,
      .right {
        display: table-cell;
        vertical-align: top;
        width: 50%;
      }
      .underline{
        text-decoration: underline;
      }
      .customer-details-left {
        display: table-cell;
        vertical-align: top;
        width: 30%;
      }

      .customer-details-right {
        display: table-cell;
        vertical-align: top;
        width: 70%;
      }
      .bill-to h3,
      .invoice-info h3 {
        margin-bottom: 5px;
        font-size: 1.2em;
        text-transform: uppercase;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .items-table thead {
        background: #8c8c8d;
        color: white;
      }

      .items-table th,
      .items-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .items-table th {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.9em;
      }

      .items-table tr:last-child td {
        border-bottom: none;
      }
      .total {
        font-size: 20px;
      }
      .footer {
        text-align: center;
        color: #6b7280;
        font-size: 0.9em;
        font-style: italic;
      }
    </style>
  </head>
  <body class=" space-y-2">
    <div class="flex">
      <div class="header-left">
        <h1>DNR TECHNICAL SERVICES</h1>
        <p>CBD Building, Office No. 226</p>
        <p>Saraf DG Metro Station Dubai, UAE</p>
        <p>Phone: +971-56 5025206</p>
        <p>Email: info@dnrtechnicalsservices.com</p>
      </div>
      <div class="header-right text-right" style="padding-top: 25px">
        <img
          src="https://dnrtechnicalsservices.com/logo3.png"
          alt=""
          style="width: 200px; height: 80px"
        />
      </div>
    </div>
    <hr></hr>
    <h1 class=" text-center underline">INVOICE</h1>
    <hr></hr>
    <div class="flex">
      <div class="bill-to left">
        <h3>Bill To</h3>
        <div class="flex">
          <p>
            <span class="label customer-details-left">Authorised Person:</span>
            <span class="customer-details-right">{{name}}</span>
          </p>
          <p>
            <span class="label customer-details-left">Company:</span>
            <span class="customer-details-right">{{company}}</span>
          </p>
          <p>
            <span class="label customer-details-left">Phone:</span>
            <span class="customer-details-right">{{phone}}</span>
          </p>
          <p>
            <span class="label customer-details-left">Email:</span>
            <span class="customer-details-right"
              >{{email}}</span
            >
          </p>
          <p>
            <span class="label customer-details-left">Address:</span>
            <span class="customer-details-right"
              >{{address}}
            </span>
          </p>
        </div>
      </div>
      <div class="invoice-info right">
        <h3>Invoice Details</h3>
        <div class="flex">
          <p>
            <span class="label customer-details-left">Invoice No:</span>
            <span class="customer-details-right">{{invoiceNo}}</span>
          </p>
          <p>
            <span class="label customer-details-left">Date:</span>
            <span class="customer-details-right">{{date}}</span>
          </p>
         
        </div>
      </div>
    </div>
    <hr></hr>
        <table class="items-table">
      <thead>
        {{thead}}
      </thead>
      <tbody>
        {{tableRows}}
      </tbody>
    </table>
    <hr></hr>
    <div class="flex font-bold">
      <p>
        <span class="left">Subtotal:</span>
        <span class="right text-right">{{subtotal}}</span>
      </p>
      <hr></hr>
      <p>
        <span class="left">VAT ({{vatPercentage}}%):</span>
        <span class="right text-right">{{vat}}</span>
      </p>
      <hr></hr>
      <p class="total">
        <span class="left">Total:</span>
        <span class="right text-right">{{total}}</span>
      </p>
    </div>
    <hr></hr>
    <div>
      <h2>Payment Terms and Notes</h2>
      <div>
        <p>
          Thank you for choosing DNR Technical Services. For any queries or
          assistance, please contact us.
        </p>
        <p>Customer Signature: ______________________</p>
        <p><strong>Authorized By:</strong> DNR Technical Services</p>
      </div>
    </div>
    <hr style="margin-top:40px;"></hr>
    <div class="footer">
      <p>

      </p>
    </div>
  </body>
</html>
`;

const InvoiceHTML = ({
  invoiceNo,
  invoiceDate,
  customerName,
  customerCompany,
  contactNumber,
  customerEmail,
  customerAddress,
  items,
  columns,
  currencyCode,
}: InvoiceHTMLProps) => {
  const newItems = items.map((item) => {
    const newItem: InvoiceItem = { ...item };
    columns.forEach((column) => {
      if (column.type === "calculated" && column.formula) {
        const calculation = calculateFormula(newItem, column.formula);
        if (calculation.error) {
          console.error(calculation.error);
          newItem[column.id] = 0; // Default to 0 on error
        } else {
          newItem[column.id] = calculation.result;
        }
      }
    });
    return newItem;
  });

  const { total, subtotal, vatAmount } = calculateTotal({ items, columns });

  const thead = `
    <thead>
      <tr>
        <th>Sl. No.</th>
        ${columns
          .map((col) =>
            col.id === "amount"
              ? `<th>${escapeHtml(col.label)} (${escapeHtml(
                  currencyCode || currency.code
                )})</th>`
              : `<th>${escapeHtml(col.label)}</th>`
          )
          .join("")}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${newItems
        .map(
          (row, index) => `
        <tr>
          <td>${index + 1}</td>
          ${columns
            .map((col) => {
              const value = row[col.id] ?? "";
              const displayValue =
                typeof value === "number" ? value.toLocaleString() : String(value);
              return `<td>${
                col.id === "amount"
                  ? `${escapeHtml(displayValue)} ${escapeHtml(currencyCode || currency.code)}`
                  : escapeHtml(displayValue)
              }</td>`;
            })
            .join("")}
        </tr>`
        )
        .join("")}
    </tbody>
  `;

  return html
    .replace("{{name}}", escapeHtml(customerName || ""))
    .replace("{{company}}", escapeHtml(customerCompany || ""))
    .replace("{{phone}}", escapeHtml(contactNumber || ""))
    .replace("{{email}}", escapeHtml(customerEmail || ""))
    .replace("{{address}}", escapeHtml(customerAddress || ""))

    .replace("{{invoiceNo}}", escapeHtml(invoiceNo || ""))
    .replace("{{date}}", escapeHtml(invoiceDate || ""))
    .replace("{{dueDate}}", escapeHtml(invoiceDate || ""))

    .replace("{{subtotal}}", escapeHtml(subtotal.toLocaleString() || ""))
    .replace("{{vat}}", escapeHtml(vatAmount.toLocaleString() || ""))
    .replace("{{total}}", escapeHtml(total.toLocaleString() || ""))

    .replace("{{symbol}}", escapeHtml(currency.symbol || ""))
    .replace("{{vatPercentage}}", escapeHtml(VAT_RATE.toString() || ""))

    .replace(
      `<thead>
        {{thead}}
      </thead>
      <tbody>
        {{tableRows}}
      </tbody>`,
      `<table class="items-table">
        ${thead}
        ${tbody}
     </table>`
    );
};

export default InvoiceHTML;
