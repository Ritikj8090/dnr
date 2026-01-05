import { BASE_URL } from "@/constant";
import type { OfferLetter, QuotationData, BillPayload } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const login = async (data: { email: string; password: string }) => {
  return api.post("/api/auth/login", data);
};

export const signup = async (data: {
  fullName: string;
  email: string;
  password: string;
  employeeId: string;
  role: "USER" | "ADMIN" | "SALES";
}) => {
  return api.post("/api/auth/signup", data);
};

export const logout = async () => {
  return api.post("/api/auth/logout");
};

export const checkAuth = async () => {
  return api.get("/api/auth/verify");
};

export const createQuotation = async (data: QuotationData) => {
  return api.post("/api/quotations/create", data);
};

export const editQuotation = async (data: QuotationData) => {
  return api.post("/api/quotations/edit", data);
};

export const getQuotationsById = async ({
  page,
  size,
  createdBy,
  quotationId,
}: {
  page?: number;
  size?: number;
  createdBy?: string | null;
  quotationId?: string;
}) => {
  return api.post("/api/quotations/paginated", {
    page,
    size,
    createdBy,
    quotationId,
  });
};

export const getBillsById = async ({
  page,
  size,
  createdBy,
  billId,
}: {
  page?: number;
  size?: number;
  createdBy?: string | null;
  billId?: string;
}) => {
  return api.post("/api/bills/get", {
    page,
    size,
    createdBy,
    billId,
  });
};

export const getBillById = async (id: string, createdBy?: string | null) => {
  return api.post("/api/bills/get", {
    id,
    createdBy: createdBy ?? undefined,
  });
};

export const updateBill = async (payload: BillPayload & { id: string }) => {
  return api.post("/api/bills/update", payload);
};

export const updateQuotation = async (id: string, data: QuotationData) => {
  return api.put(`/api/quotation/update/${id}`, data);
};

export const downloadQuotationPdf = async (
  quotationId: string
): Promise<Blob> => {
  const response = await axios.get(
    `/api/quotation/generate-html-pdf/${quotationId}`,
    {
      responseType: "blob", // IMPORTANT: gets binary stream
    }
  );
  return response.data;
};

export const downloadOfferLetterPdf = async (html: string): Promise<Blob> => {
  const response = await axios.post(
    "/api/offer-letters/generate",
    { html },
    { responseType: "blob" }
  );
  return response.data;
};

export const getAllUsers = async () => {
  return api.post("api/auth/all-users");
};

export const deleteUserById = async (id: string) => {
  return api.post("api/auth/delete-user", { id });
};

export const editUserPassword = async (id: string, newPassword: string) => {
  return api.post("api/auth/edit", { id, newPassword });
};

export const createBill = async (data: BillPayload) => {
  return api.post("/api/bills/create", data);
};

export const createOfferLetter = async (data: OfferLetter) => {
  return api.post("/api/offer-letters/save", data);
};

export const getOfferLetterById = async ({
  page,
  size,
  createdBy,
  offerLetterId,
}: {
  page?: number;
  size?: number;
  createdBy?: string | null;
  offerLetterId?: string;
}) => {
  return api.post("/api/offer-letters/get", {
    page,
    size,
    createdBy,
    offerLetterId,
  });
};

export const getTotalDocCount = async ({
  createdBy,
}: {
  createdBy: string;
}) => {
  const o = (await api.post("/api/offer-letters/get", { createdBy })).data;
  const b = (await api.post("/api/bills/get", { createdBy })).data;
  const q = (await api.post("/api/quotations/paginated", { createdBy })).data;
  return { o, b, q };
};
