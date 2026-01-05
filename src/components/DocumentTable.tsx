import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FileText, Search, File, type LucideProps } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";

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

interface DocumentTable {
  children: React.ReactNode;
  length: number;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  showSearchBar?: boolean;
  logo?: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  title?: string;
}

export const DocumentTable = ({
  children,
  searchTerm,
  setSearchTerm,
  length,
  loaderRef,
  hasMore,
  showSearchBar = true,
  logo:Logo,
  title
}: DocumentTable) => {
  return (
    <div className="lg:col-span-2">
      <motion.div variants={itemVariants}>
        <Card className="shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                {Logo && <Logo className="h-5 w-5 text-primary" /> || <FileText className="h-5 w-5 text-primary" />}
                {title || "Recent Documents"}
                <Badge variant="secondary" className="ml-2 bg-primary/50">
                  Showing {length} records
                </Badge>
              </CardTitle>
              {showSearchBar && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    placeholder="Search by Reference No, Creation Date, or Date Range"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 lg:w-80 w-full"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto px-2 h-[652px]">
              {length === 0 ? (
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
                        <File className="h-12 w-12" />
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
                      No Documents Found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Get started by creating your first document and adding it
                      to the system.
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {children}
                  <div
                    ref={loaderRef}
                    className="py-4 text-center text-muted-foreground"
                  >
                    {hasMore ? "Loading more..." : "No more data"}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export const DocumentHead = ({ children }: { children: React.ReactNode }) => {
  return (
    <TableHeader>
      <TableRow className="">{children}</TableRow>
    </TableHeader>
  );
};

export const DocumentContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Table>{children}</Table>;
};

export const DocumentBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <TableBody>
      <AnimatePresence>{children}</AnimatePresence>
    </TableBody>
  );
};
