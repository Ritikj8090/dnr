import { FileText } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from "@/constant";
import { useDispatch } from "react-redux";
import { setPdfDialogOpen } from "@/store/PdfPreview";
import { cn } from "@/lib/utils";
import { setLoading } from "@/store/globalSlice";

interface PdfConvertorProps {
  htmlFunction: () => Promise<string>;
  endPoint: string;
  disabled: boolean;
}

const PdfConvertor = ({
  htmlFunction,
  endPoint,
  disabled,
}: PdfConvertorProps) => {
  const dispatch = useDispatch();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const htmlWithTable = await htmlFunction();
      // console.log(htmlWithTable);
      const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlWithTable }),
        credentials: "include",
      });

      if (!response.ok) {
        dispatch(setLoading(false))
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      dispatch(setPdfDialogOpen(url));
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      console.error("❌ Error generating PDF:", error);
    } finally {
      dispatch(setLoading(false))
      setIsGeneratingPdf(false);
    }
  };
  return (
    <button
      className={cn(" flex items-center gap-2", disabled && " opacity-70 cursor-not-allowed")}
      onClick={generatePDF}
      disabled={isGeneratingPdf || disabled}
    >
      {isGeneratingPdf ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Export PDF
        </>
      )}
    </button>
  );
};

export default PdfConvertor;
