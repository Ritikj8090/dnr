import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type JSX, type SetStateAction } from "react";

interface ShowLogsProps {
  showLogs: boolean;
  setShowLogs: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  element: JSX.Element
}

const ShowLogs = ({
  showLogs,
  setShowLogs,
  title,
  description,
  element
}: ShowLogsProps) => {
  return (
    <Dialog open={showLogs} onOpenChange={setShowLogs}>
      <DialogContent className=" min-w-[900px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {element}
      </DialogContent>
    </Dialog>
  );
};

export default ShowLogs;
