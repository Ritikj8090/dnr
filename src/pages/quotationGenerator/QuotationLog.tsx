import {
  DocumentBody,
  DocumentContent,
  DocumentHead,
  DocumentTable,
} from "@/components/DocumentTable";
import {
  Edit,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import type { QuotationData } from "../dashboard/DashboardPage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getQuotationsById } from "@/lib/apis";
import { getStatusColor, PAGE_SIZE } from "@/constant";
import type { startGrid } from "@/types";

interface QuotationLogProps {
  setShowLogs: React.Dispatch<SetStateAction<boolean>>;
  setStartGrid: React.Dispatch<SetStateAction<startGrid[]>>;
  defaultStatGrid: startGrid[];
}

const QuotationLog = ({ setShowLogs, setStartGrid, defaultStatGrid }: QuotationLogProps) => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
console.log(quotations)
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchQuotations = useCallback(async () => {
    try {
      const response = await getQuotationsById({
        page,
        size: PAGE_SIZE,
        createdBy: user.role === "USER" ? user.id : undefined,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      const data = (await response.data.resultContent) || [];
      const totalCount = response.data.totalCount || 0;

      setQuotations((prev) => {
        const newData = page === 0 ? data : [...prev, ...data];
        setHasMore(newData.length < totalCount); // ✅ accurate length check
        return newData;
      });

      const count = [totalCount, 0, 0, 0];

      const updatedStatGrid = defaultStatGrid.map((item, index) => ({
        ...item,
        count: count[index],
      }));

      setStartGrid(updatedStatGrid)

      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, user.id, user.role, setStartGrid, defaultStatGrid]);

  useEffect(() => {
    if (page === 0) fetchQuotations();
  }, [fetchQuotations, page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchQuotations();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchQuotations, hasMore, loading, page]);

  const filteredUsers: QuotationData[] = quotations?.filter((doc) => {
    const matchesSearch =
      doc.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.expiration_at.toLowerCase().includes(searchTerm.toLowerCase());
    doc.reference_no.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  return (
    <DocumentTable
      length={filteredUsers.length}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loaderRef={observerRef}
      hasMore={hasMore}
    >
      <DocumentContent>
        <DocumentHead>
          {[
            "File",
            "Reference No.",
            "Author",
            "Creation Date",
            "Expiry Date",
            "Status",
            "Doc Version",
            "Actions",
          ].map((item) => (
            <TableHead key={item} className="font-semibold">
              {item}
            </TableHead>
          ))}
        </DocumentHead>
        <DocumentBody>
          {filteredUsers.map((doc, index) => (
            <motion.tr
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="even:bg-primary-foreground/40 transition-colors"
            >
              <TableCell className="font-medium">
                <FileText className="h-4 w-4 text-primary" />
              </TableCell>
              <TableCell className="text-primary font-medium">
                {doc.reference_no}
              </TableCell>
              <TableCell>{doc.author_name}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.expiration_at}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(doc.status)} border`}>
                  {doc.status || "Created"}
                </Badge>
              </TableCell>
              <TableCell className=" font-mono">{doc.doc_version}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setShowLogs(false);
                        navigate(`/quotation-generator/${doc.id}`);
                        window.location.reload();
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </DocumentBody>
      </DocumentContent>
    </DocumentTable>
  );
};

export default QuotationLog;
