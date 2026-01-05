import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  BadgeIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteUserById } from "@/lib/apis";
import { useDispatch } from "react-redux";
import { setFailed, setShowPopUp } from "@/store/popupSlice";
import { setAlertShowPopUp, setIsSubmitting } from "@/store/alertPopupSlice";

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

interface UsersTableProps {
  filteredUsers: User[];
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  searchTerm: string;
  roleFilter: string;
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

const UsersTable = ({
  filteredUsers,
  users,
  setUsers,
  searchTerm,
  roleFilter,
}: UsersTableProps) => {
  const dispatch = useDispatch();

  const deleteUser = async (userId: string) => {
    try {
      await deleteUserById(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      dispatch(
        setShowPopUp({
          title: "User Deleted",
          description: "User deleted successfully",
        })
      );
    } catch (error) {
      dispatch(
        setShowPopUp({
          title: "Error Deleting User",
          description: "Something went wrong while deleting user",
        })
      );
      dispatch(setFailed(true));
      console.log(error);
    } finally {
      dispatch(setIsSubmitting(false))
    }
  };

  const showAlert = (userId: string, fullName: string) => {
    dispatch(
      setAlertShowPopUp({
        title: "Are you sure?",
        description: (
          <>
            You want to delete this <strong>{fullName}</strong> user? This
            action cannot be undone.
          </>
        ),
        isSubmitting: false,
        onClick: () => deleteUser(userId),
      })
    );
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              User Management
              <Badge variant="secondary" className="ml-2 bg-primary/50">
                Showing {filteredUsers.length} of {users.length} users
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto px-2">
            <ScrollArea className=" h-[500px]">
              {filteredUsers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center justify-center py-16 w-full h-full"
                >
                  {/* Animated Icon */}
                  <motion.div
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12" />
                      </div>
                      {/* Floating particles */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary/40 rounded-full"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                        className="absolute -bottom-1 -left-3 w-4 h-4 bg-primary/50 rounded-full"
                      />
                    </div>
                  </motion.div>

                  {/* Main Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      {searchTerm || roleFilter !== "all"
                        ? "No Users Match Your Search"
                        : "No Users Found"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {searchTerm || roleFilter !== "all"
                        ? "Try adjusting your search criteria or filters to find the users you're looking for."
                        : "Get started by adding your first user to the system. You can create users with different roles and permissions."}
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Full Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">
                        Employee ID
                      </TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="even:bg-primary-foreground/40 transition-colors"
                        >
                          <TableCell>
                            <p className="font-medium">{user.fullName}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-primary font-mono capitalize">
                                {user.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BadgeIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">
                                {user.employeeId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getRoleColor(
                                user.role
                              )} border font-medium`}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    showAlert(user.id, user.fullName)
                                  }
                                  className="text-red-600 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsersTable;
