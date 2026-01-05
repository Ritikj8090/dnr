import { Dialog, DialogHeader, DialogTitle } from "./ui/dialog";
// ✅ Correct import from your custom wrapper:
import { DialogContent } from "@/components/ui/dialog";
import type { RootState } from "@/store";
import { setPdfDialogClose } from "@/store/PdfPreview";
import { Eye, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const PdfPreview = () => {
  const dispatch = useDispatch();
  const { isPdfDialogOpen, pdfUrl } = useSelector(
    (state: RootState) => state.pdfPreview
  );
  return (
    <Dialog
      open={isPdfDialogOpen}
      onOpenChange={() => dispatch(setPdfDialogClose())}
    >
      <DialogContent
        className=" min-w-[calc(100%-5rem)] lg:min-w-[calc(100%-50rem)] min-h-[calc(100%-100px)]
"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              PDF Preview
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-[90vh] border rounded"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-[70vh] text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>PDF preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreview;
