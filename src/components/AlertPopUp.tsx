import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { RootState } from "@/store";
import { resetAlertPopUp } from "@/store/alertPopupSlice";
import { Loader2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export function AlertPopUp() {
  const dispatch = useDispatch();
  const { title, description, showAlertPopUp, onClick, isSubmitting } =
    useSelector((state: RootState) => state.alert);
  return (
    <AlertDialog
      open={showAlertPopUp}
      onOpenChange={() => dispatch(resetAlertPopUp())}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            className=" w-24"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2Icon className=" animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
