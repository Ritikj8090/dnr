import {
  DocumentBody,
  DocumentContent,
  DocumentHead,
  DocumentTable,
} from "@/components/DocumentTable";
import {
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { TableCell, TableHead } from "@/components/ui/table";
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
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getBillsById } from "@/lib/apis";
import { currency, PAGE_SIZE } from "@/constant";
import type { Country, Invoice, startGrid } from "@/types";

interface BillLogProps {
  defaultStatGrid: startGrid[]
  setShowLogs: React.Dispatch<SetStateAction<boolean>>;
  setStartGrid: React.Dispatch<SetStateAction<startGrid[]>>;
}

const BillLog = ({ setShowLogs, setStartGrid, defaultStatGrid }: BillLogProps) => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Invoice[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const fetchBills = useCallback(async () => {
    try {
      const response = await getBillsById({
        page,
        size: PAGE_SIZE,
        createdBy: user.role === "USER" ? user.id : undefined,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      const data = (await response.data.resultContent.content) || [];
      const totalCount = response.data.resultContent.total || 0;
      setBills((prev) => {
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
    if (page === 0) fetchBills();
  }, [fetchBills, page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchBills();
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
  }, [fetchBills, hasMore, loading, page]);

  const filteredUsers: Invoice[] = bills?.filter((doc) => {
    const matchesSearch =
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    doc.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  console.log(bills)
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
            "Invoice No.",
            "Customer Name",
            "Invoice Date",
            "Total Amount",
            "Received Amount",
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
                {doc.invoiceNo}
              </TableCell>
              <TableCell className=" capitalize">{doc.customerName}</TableCell>
              <TableCell>{doc.invoiceDate}</TableCell>
              <TableCell>{doc.currencyCode + " " + doc.totalAmount}</TableCell>
              <TableCell>{doc.currencyCode + " " + doc.amountReceived}</TableCell>
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
                        navigate(`/bill-generator/${doc.id}`);
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

export default BillLog;
