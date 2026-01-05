import { escapeHtml } from "@/constant";

interface OfferLetterParams {
  name: string;
  position: string;
  nationality: string;
  joiningDate: string;
  basic: number | string;
  functional: number | string;
  operational: number | string;
  monthlyTotal: number | string;
  annualCtc: number | string;
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offer of Employment - DNR Technical Services</title>
    <style>
      body {
        line-height: 20px;
        position: relative;
      }
      .text-center {
        text-align: center;
      }
      .align-right {
        align-items: end;
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
      .underline {
        text-decoration: underline;
      }
      .customer-details-left {
        display: table-cell;
        vertical-align: top;
        width: 20%;
      }

      .customer-details-right {
        display: table-cell;
        vertical-align: top;
        width: 80%;
      }
      .bill-to h3,
      .invoice-info h3 {
        margin-bottom: 5px;
        font-size: 1.2em;
        text-transform: uppercase;
      }
      .items-table {
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      thead {
        background: #85a5ce;
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
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      table,
      th,
      td {
        border: 1px solid #000;
      }
      th,
      td {
        padding: 8px;
        text-align: center;
      }
      .align-center {
        display: flex;
        justify-content: center;
      }
      .img1 {
        width: 230px;
      }
      .img2 {
        width: 140px;
      }
    </style>
  </head>
  <body class="space-y-2">
    <div class="flex">
      <div class="header-left font-bold">
        <p>DNR Technical Services</p>
        <p>CBD Building, Office No. 226, Saraf DG Metro Station Dubai, UAE</p>
      </div>
      <img
        src="https://dnrtechnicalsservices.com/logo3.png"
        alt=""
        style="width: 150px; padding-left: 50px;"
        class="header-right"
      />
    </div>
    <hr />
    <div>
      <p class="font-bold">{{joiningDate}}</p>
      <p class="font-bold">Ref: DNR/MNP/2025/06/26</p>
      <p class="font-bold">To:</p>
      <p>Mr. {{name}}</p>
      <p>Nationality: {{nationality}}</p>
      <p>Location: Dubai, UAE</p>
    </div>
    <hr />
    <div>
      <h2 class="text-center underline">Offer of Employment</h2>
      <p>Dear <strong>Mr. {{name}}</strong></p>
      <p>
        We are pleased to offer you employment at
        <b>DNR Technical Services</b> as an <b>{{position}}</b>. We welcome you
        to our team and look forward to your contributions to our organization.
      </p>
      <p class="font-bold">Compensation and Benefits</p>

      <p>
        Your salary will be <b>AED {{monthlyTotal}} per month</b>, with the following
        breakdown:
      </p>

    </div>
    <div class="align-center">
      <table>
        <thead>
          <tr>
            <th>Particular</th>
            <th>Per Month (AED)</th>
          </tr>
        </thead>
        <tr>
          <td>Basic Salary</td>
          <td>{{basic}}</td>
        </tr>
        <tr>
          <td>Functional Allowance</td>
          <td>{{functional}}</td>
        </tr>
        <tr>
          <td>Operational Allowance</td>
          <td>{{operational}}</td>
        </tr>
        <tr>
          <td><b>Total</b></td>
          <td><b>{{monthlyTotal}}</b></td>
        </tr>
      </table>
    </div>
    <div>
   <p style="font-weight:bold; margin:8px 0 16px 0;">
  Your annual CTC will be AED {{annualCtc}}.
</p>

    </div>
    <div>
      <p>
        In addition to your salary, the following benefits will be provided:
      </p>
      <ul>
        <li>Resident visa</li>
        <li>Workman’s compensation insurance</li>
        <li>Basic medical insurance</li>
        <li>Company-shared accommodation</li>
        <li>
          <strong>Off Days:</strong> 4 days per month, in addition to national
          holidays
        </li>
        <li><strong>Overtime Hours:</strong> As per site requirements</li>
        <li><strong>Overtime Rate:</strong> 1.25 times the basic salary</li>
      </ul>
    </div>
    <div>
      <h3>Conditions of Employment</h3>
      <ol>
        <li>Your working days will be <strong>Monday to Saturday.</strong></li>
        <li>
          Your daily working hours will be <strong>10 hours per day</strong>,
          depending on the assigned project.
        </li>
        <li>
          Your <strong>probationary period</strong> will be
          <strong>six (6) months.</strong>
        </li>
        <li>
          This employment contract is for a
          <strong>fixed term of two (2) years.</strong>
        </li>
        <li>
          In the event of <strong>early termination</strong> by the employee
          before completing the two-year term, a penalty of
          <strong>AED 6,000</strong> will be imposed.
        </li>
        <li>
          Furthermore, any
          <strong>deposited funds will be non-refundable</strong> under all
          circumstances.
        </li>
        <li>
          Candidates must undergo a
          <strong>medical and practical assessment in Dubai.</strong> Should an
          individual <strong>fail these assessments</strong>, the company will
          <strong>not be liable</strong> for any associated
          <strong>financial loss or repercussions.</strong>
        </li>
        <li>
          Additionally, the company
          <strong>assumes no responsibility</strong> for any
          <strong>fines, legal actions, or consequences</strong> resulting from
          unsafe behavior in Dubai.
        </li>
        <li>
          Your <strong>start date</strong> will be confirmed upon your
          <strong>written acceptance.</strong>
        </li>
      </ol>
    </div>
    <div>
      <h3>Legal Compliance</h3>
      <p>
        As per UAE laws, you are only permitted to work for DNR Technical
        Services while under our sponsorship. Any additional paid work outside
        the company requires prior written consent.
        <strong>Required Documents.</strong>
      </p>
      <p>Please provide the following documents for our records:</p>
      <ul>
        <li>Copy of passport</li>
        <li>Aadhar Card</li>
        <li>Driving license (if available)</li>
        <li>Recent passport-size photograph</li>
        <li>Emergency contact details (UAE and home country)</li>
      </ul>

      <p>
        Once we receive these documents, we will send you the official
        <strong>Employment Contract</strong> and
        <strong>Non-Disclosure Agreement</strong> for your signature.
      </p>
      <p>
        On behalf of <strong>DNR Technical Services</strong>, we extend our
        congratulations on your selection. We look forward to a long and
        successful professional relationship.
      </p>
      <p>
        Please confirm your acceptance of this offer by signing and returning a
        copy of this letter.
      </p>
      <div>
        <p><strong>Sincerely,</strong></p>
        <p>Kiran Rai</p>
        <p>Director</p>
        <p>DNR Technical Services</p>
        <p>Dubai, UAE</p>
      </div>
    </div>
    <hr />
    <div>
      <h3>Confidentiality Agreement</h3>
      <p>
        I understand that during my employment with DNR Technical Services, I
        will have access to confidential information, including details about
        customers, suppliers, vendors, and licenses. This information may be
        technical or non-technical in nature but holds significant commercial
        value. Any unauthorized disclosure or misuse of such information could
        harm the company’s business and reputation. Therefore, I am obligated to
        handle all confidential information responsibly and in compliance with
        company policies. This includes maintaining strict confidentiality even
        after my employment ends.
      </p>

      <p>Confidential Information includes, but is not limited to:</p>
      <ul>
        <li>
          Business data such as marketing, customer details, sales, and
          strategic plans.
        </li>
        <li>Proprietary software programs, documentation, and materials.</li>
        <li>Confidential information from vendors and suppliers.</li>
      </ul>

      <p>I agree that:</p>
      <ul>
        <li>
          Confidential Information remains the exclusive property of
          <strong>DNR Technical Services. </strong>
        </li>
        <li>
          It is considered a trade secret and must not be disclosed to
          unauthorized parties.
        </li>
        <li>
          I will not copy, share, or misuse any confidential data without
          express written consent.
        </li>
        <li>
          Even after my employment ends, I will maintain the confidentiality of
          all proprietary information.
        </li>
      </ul>
    </div>
    <div>
      <p>
        By signing below, I acknowledge and accept the terms of this
        <strong>Confidentiality Agreement. </strong>
      </p>
      <p><strong>Name:</strong>{{name}} </p>
      <p><strong>Signature: ______________________</strong></p>
      <p><strong>Date: ______________________</strong></p>
    </div>
    <div>
        <img class="img1" src="signature.png" alt="signature" />
        <img class="img2" src="stamp.png" alt="stamp" />
      </div>
      <div class=" font-bold">
        <p>Kiran Rai</p>
        <p>Director</p>
        <p>DNR Technical Services</p>
        <p>Services Dubai, UAE</p>
      </div>
  </body>
</html>
`;

const formatNum = (v: number | string) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n.toLocaleString() : "0";
};

const generateOfferLetterHtml = ({
  name,
  position,
  nationality,
  joiningDate,
  basic,
  functional,
  operational,
  monthlyTotal,
  annualCtc,
}: OfferLetterParams) => {
  return html
    .replaceAll("{{name}}", escapeHtml(name || ""))
    .replaceAll("{{position}}", escapeHtml(position || ""))
    .replaceAll("{{nationality}}", escapeHtml(nationality || ""))
    .replaceAll("{{joiningDate}}", escapeHtml(joiningDate || ""))
    .replaceAll("{{basic}}", escapeHtml(formatNum(basic)))
    .replaceAll("{{functional}}", escapeHtml(formatNum(functional)))
    .replaceAll("{{operational}}", escapeHtml(formatNum(operational)))
    .replaceAll("{{monthlyTotal}}", escapeHtml(formatNum(monthlyTotal)))
    .replaceAll("{{annualCtc}}", escapeHtml(formatNum(annualCtc)));
};

export default generateOfferLetterHtml;
