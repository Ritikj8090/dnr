import { checkAuth } from "@/lib/apis";
import { clearAuth, setAuth, setLoading } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("🔐 Checking authentication...");

        const res = (await checkAuth()).data;
        console.log("🔐 Authentication response:", res.user);

        if (!res) {
          throw new Error("Missing authentication details in response");
        }

        dispatch(
          setAuth({
            user: res.user
          })
        );
      } catch (error) {
        console.warn("⛔ Authentication failed:", error);
        dispatch(clearAuth());
      }
      finally {
        dispatch(setLoading(false)); // Set loading to false after auth check
      }
    };

    verifyAuth();
  }, [dispatch]);
};

export default useAuth;
