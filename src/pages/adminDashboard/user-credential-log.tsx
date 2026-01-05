import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { motion } from "framer-motion";
import {
  DocumentBody,
  DocumentContent,
  DocumentHead,
  DocumentTable,
} from "@/components/DocumentTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";
import {
  deleteUserById,
  getAllUsers,
  editUserPassword,
} from "@/lib/apis";
import { useDispatch } from "react-redux";
import { setAlertShowPopUp } from "@/store/alertPopupSlice";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import { Edit, MoreHorizontal, Trash, Eye, EyeOff, type LucideProps } from "lucide-react";

interface StatGridProps {
  title: string;
  count: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
}

interface UserCredentialLogProps {
  defaultStatGrid: {
    title: string;
    count: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
    bgColor: string;
  }[];
  logo?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title?: string;
  roleFilter: string;
  setShowLogs: React.Dispatch<SetStateAction<boolean>>;
  setStartGrid: React.Dispatch<SetStateAction<StatGridProps[]>>;
  searchTerm: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 border-red-200";
    case "MANAGER":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "USER":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const UserCredentialLog: React.FC<UserCredentialLogProps> = ({
  setShowLogs,
  setStartGrid,
  defaultStatGrid,
  roleFilter,
  searchTerm,
  logo,
  title,
}) => {
  const dispatch = useDispatch();

  // data
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // dialog state
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  // password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [saving, setSaving] = useState(false);

  // fetch users + stats
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();
      if (response.status !== 200) throw new Error("Failed to fetch users");

      const data: User[] = response.data || [];
      const totalCount = data.length || 0;
      const adminCount = data.filter((u) => u.role === "ADMIN").length;
      const managerCount = data.filter((u) => u.role === "MANAGER").length;
      const employeeCount = data.filter((u) => u.role === "USER").length;

      setUsers((prev) => {
        const newData = page === 0 ? data : [...prev, ...data];
        setHasMore(newData.length < totalCount); // placeholder if you later paginate server-side
        return newData;
      });

      // update stats on top (admin/manager/user/total)
      const count = [adminCount, managerCount, employeeCount, totalCount];
      const updatedStatGrid = defaultStatGrid.map((item, index) => ({
        ...item,
        count: count[index] ?? item.count,
      }));
      setStartGrid(updatedStatGrid);

      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      dispatch(
        setShowPopUp({
          title: "Failed to fetch users",
          description: "Please try again later.",
        })
      );
      dispatch(setFailed(true));
    } finally {
      setLoading(false);
    }
  }, [page, defaultStatGrid, setStartGrid, dispatch]);

  useEffect(() => {
    if (page === 0) fetchUsers();
  }, [fetchUsers, page]);

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchUsers();
        }
      },
      { root: null, rootMargin: "20px", threshold: 0.1 }
    );
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchUsers, hasMore, loading]);

  // filters
  const filteredUsers: User[] = users?.filter((user) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.employeeId.toLowerCase().includes(q);
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // delete flow
  const handleDelete = async (userId: string) => {
    try {
      const res = (await deleteUserById(userId)).data;
      if (res === "User deleted successfully") {
        dispatch(
          setShowPopUp({
            title: "User Deleted Successfully",
            description: `The user has been removed.`,
          })
        );
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        dispatch(
          setShowPopUp({
            title: "User Deletion Failed",
            description: res?.data?.resultMessage ?? "Unknown error",
          })
        );
        dispatch(setFailed(true));
      }
    } catch (error) {
      dispatch(
        setShowPopUp({
          title: "Error Deleting User",
          description: "Something went wrong while deleting user.",
        })
      );
      dispatch(setFailed(true));
      console.error(error);
    }
  };

  const confirmDelete = (userId: string, fullName: string) => {
    dispatch(
      setAlertShowPopUp({
        title: "Are you sure?",
        description: (
          <>
            You want to delete <strong>{fullName}</strong>? This action cannot
            be undone.
          </>
        ),
        isSubmitting: false,
        onClick: () => handleDelete(userId),
      })
    );
  };

  // password dialog open
  const openPasswordDialog = (id: string, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setNewPassword("");
    setConfirmPassword("");
    setShowPw(false);
    setShowPw2(false);
    setIsPasswordChanging(true);
  };

  // password save
  const handleSavePassword: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    if (!newPassword || newPassword.trim().length < 6) {
      dispatch(
        setShowPopUp({
          title: "Weak Password",
          description: "Password must be at least 6 characters.",
        })
      );
      dispatch(setFailed(true));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(
        setShowPopUp({
          title: "Passwords do not match",
          description: "Please ensure both password fields match.",
        })
      );
      dispatch(setFailed(true));
      return;
    }

    try {
      setSaving(true);
      const res = await editUserPassword(selectedUserId, newPassword);
      if (res.status === 200) {
        dispatch(
          setShowPopUp({
            title: "Password Updated",
            description: `Password for ${selectedUserName} updated successfully.`,
          })
        );
        setIsPasswordChanging(false);
      } else {
        dispatch(
          setShowPopUp({
            title: "Update Failed",
            description: "Unexpected response from server.",
          })
        );
        dispatch(setFailed(true));
      }
    } catch (err: any) {
      dispatch(
        setShowPopUp({
          title: "Error",
          description:
            err?.response?.data ?? "Something went wrong while updating password.",
        })
      );
      dispatch(setFailed(true));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DocumentTable
        logo={logo}
        title={title}
        length={filteredUsers.length}
        searchTerm={searchTerm}
        setSearchTerm={() => {}}
        loaderRef={observerRef}
        hasMore={hasMore}
        showSearchBar={false}
      >
        <DocumentContent>
          <DocumentHead>
            {["Full Name", "Email", "Employee ID", "Role", "Actions"].map(
              (item) => (
                <TableHead key={item} className="font-semibold">
                  {item}
                </TableHead>
              )
            )}
          </DocumentHead>

          <DocumentBody>
            {filteredUsers.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="even:bg-primary-foreground/40 transition-colors"
              >
                <TableCell className="text-primary font-medium">
                  {doc.fullName}
                </TableCell>
                <TableCell className="capitalize font-mono">
                  {doc.email}
                </TableCell>
                <TableCell className="font-mono">{doc.employeeId}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getRoleColor(
                      doc.role
                    )} border font-medium font-mono`}
                  >
                    {doc.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => openPasswordDialog(doc.id, doc.fullName)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => confirmDelete(doc.id, doc.fullName)}
                        className="text-red-600 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2 text-red-600" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </DocumentBody>
        </DocumentContent>
      </DocumentTable>

      {/* Edit Password Dialog */}
      <Dialog open={isPasswordChanging} onOpenChange={setIsPasswordChanging}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSavePassword}>
            <DialogHeader>
              <DialogTitle>Edit Password</DialogTitle>
              <DialogDescription>
                Set a new password for{" "}
                <span className="font-medium">{selectedUserName}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="new-password"
                    type={showPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPw((v) => !v)}
                    className="shrink-0"
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="confirm-password"
                    type={showPw2 ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPw2((v) => !v)}
                    className="shrink-0"
                  >
                    {showPw2 ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserCredentialLog;
