import type { RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Loading = () => {
  const { isLoading } = useSelector((state: RootState) => state.global);
  console.log(isLoading);
  return (
    isLoading ? (
      <div className=" absolute inset-0 flex items-center justify-center z-[100] bg-primary">
        <div className=" absolute inset-0 bg-black opacity-50" />
        <Loader2 className=" animate-spin h-12 w-12 text-primary-foreground" />
      </div>
    ) : <></>
  );
};

export default Loading;
