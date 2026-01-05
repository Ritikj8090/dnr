import type { Column, QuotationItem } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import type { z } from "zod";
import type {
  clientInformationSchema,
  quoteDetailsSchema,
} from "@/pages/quotationGenerator/QuotationGeneratePage";
import { calculateFormula, currency, VAT_RATE } from "@/constant";
import RAW_HTML from "@/html/q.html?raw";

interface QuotationHTMLProps {
  columns: Column[];
  items: QuotationItem[];
  total: number;
  subtotal: number;
  vatAmount: number;
  quoteDetails: UseFormReturn<z.infer<typeof quoteDetailsSchema>>;
  clientInformation: UseFormReturn<z.infer<typeof clientInformationSchema>>;
}

const html = RAW_HTML;

// safe formatter for numbers/strings
const fmt = (val: any) =>
  typeof val === "number" ? val.toLocaleString() : String(val ?? "");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const QuotationHTML = async ({
  columns,
  items,
  total,
  subtotal,
  vatAmount,
  quoteDetails,
  clientInformation,
}: QuotationHTMLProps) => {
  const { referenceNo, date, currencyCode } = quoteDetails.getValues();
  const {
    companyName,
    attention,
    address,
    designation,
    email,
    phone,
    website,
    subject,
    project,
    title,
    scopes,
  } = clientInformation.getValues();

  // Compute calculated columns in-place honoring the current column order
  const newItems = items.map((item) => {
    const newItem: any = { ...item };
    for (const column of columns) {
      if (column.type === "calculated" && column.formula) {
        const calculation = calculateFormula(newItem, column.formula);
        newItem[column.id] = calculation.error ? 0 : calculation.result;
      }
    }
    return newItem as QuotationItem;
  });

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
            const value = fmt((row as any)[col.id]);
            return `<td>${
              col.id === "amount"
                ? `${escapeHtml(value)} ${escapeHtml(
                    currencyCode || currency.code
                  )}`
                : escapeHtml(value)
            }</td>`;
          })
          .join("")}
      </tr>`
      )
      .join("")}
  </tbody>
`;

  const scopeList =
    scopes?.map((scope) => `<li>${escapeHtml(scope)}</li>`).join("") || "";

  return html
    .replace("{{referenceNo}}", escapeHtml(referenceNo || ""))
    .replace("{{date}}", escapeHtml(format(date, "dd MMM yyyy")))
    .replace(/{{companyName}}/g, escapeHtml(companyName))
    .replace("{{attention}}", escapeHtml(attention))
    .replace("{{address}}", escapeHtml(address))
    .replace("{{designation}}", escapeHtml(designation || ""))
    .replace("{{email}}", escapeHtml(email))
    .replace("{{phone}}", escapeHtml(phone))
    .replace(/{{website}}/g, escapeHtml(website || ""))
    .replace("{{subject}}", escapeHtml(subject))
    .replace("{{project}}", escapeHtml(project))
    .replace("{{title}}", escapeHtml(title))
    .replace("{{subtotal}}", escapeHtml(fmt(subtotal)))
    .replace("{{vat}}", escapeHtml(fmt(vatAmount)))
    .replace("{{total}}", escapeHtml(fmt(total)))
    .replace("{{symbol}}", escapeHtml(currency.symbol || ""))
    .replace("{{vatPercentage}}", escapeHtml(VAT_RATE.toString() || ""))
    .replace("{{thead}}", thead)
    .replace("{{tableRows}}", tbody)
    .replace("{{scope}}", scopeList);
};

export default QuotationHTML;
