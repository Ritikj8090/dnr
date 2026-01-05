import {
  DocumentBody,
  DocumentContent,
  DocumentHead,
  DocumentTable,
} from "@/components/DocumentTable";
import { Download, Edit, Eye, FileText, MoreHorizontal } from "lucide-react";
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
// import { useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import PdfConvertor from "@/components/PdfConvertor";
import generateOfferLetterHtml from "@/html/offer-letter";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getOfferLetterById } from "@/lib/apis";
import { getStatusColor, PAGE_SIZE } from "@/constant";
import type { Country, OfferLetterBackend, startGrid } from "@/types";

interface OfferLetterLogProps {
  defaultStatGrid: startGrid[];
  setShowLogs: React.Dispatch<SetStateAction<boolean>>;
  setStartGrid: React.Dispatch<SetStateAction<startGrid[]>>;
}

const OfferLetterLog = ({
  setShowLogs,
  setStartGrid,
  defaultStatGrid,
}: OfferLetterLogProps) => {
  // const navigate = useNavigate();
  const [offerLetter, setOfferLetter] = useState<OfferLetterBackend[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchOfferLetter = useCallback(async () => {
    try {
      const response = await getOfferLetterById({
        page,
        size: PAGE_SIZE,
        createdBy: user.role === "USER" ? user.id : undefined,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      console.log(response.data);
      const data = (await response.data.resultContent.content) || [];
      const totalCount = response.data.resultContent.total || 0;

      setOfferLetter((prev) => {
        const newData = page === 0 ? data : [...prev, ...data];
        setHasMore(newData.length < totalCount); // ✅ accurate length check
        return newData;
      });

      const count = [totalCount, 0, 0, 0];

      const updatedStatGrid = defaultStatGrid.map((item, index) => ({
        ...item,
        count: count[index],
      }));

      setStartGrid(updatedStatGrid);

      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, user.id, user.role, setStartGrid, defaultStatGrid]);

  useEffect(() => {
    if (page === 0) fetchOfferLetter();
  }, [fetchOfferLetter, page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchOfferLetter();
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
  }, [fetchOfferLetter, hasMore, loading, page]);

  const filteredUsers: OfferLetterBackend[] = offerLetter?.filter((doc) => {
    const matchesSearch =
      doc.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.joining_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.position.toLowerCase().includes(searchTerm.toLowerCase());
    doc.ctc.toLowerCase().includes(searchTerm.toLowerCase());
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
            "Candidate Name",
            "Position",
            "Joining Date",
            "CTC",
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
                {doc.candidate_name}
              </TableCell>
              <TableCell>{doc.position}</TableCell>
              <TableCell>{doc.joining_date}</TableCell>
              <TableCell>{doc.currency_code + " " + doc.ctc}</TableCell>
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
                    {/* This keeps shadcn DropdownMenuItem styling/animation */}
                    <DropdownMenuItem asChild>
                      <PdfConvertor
                        endPoint="api/offer-letters/generate"
                        disabled={!doc?.id}
                        htmlFunction={async () => {
                          const sb =
                            (doc as any).salary_breakdown ??
                            (doc as any).salaryBreakdown;

                          const pick = (label: string) => {
                            if (Array.isArray(sb)) {
                              return (
                                Number(
                                  sb.find(
                                    (x: any) =>
                                      (x.label ?? "").toLowerCase() ===
                                      label.toLowerCase()
                                  )?.amount
                                ) || 0
                              );
                            }
                            if (sb && typeof sb === "object") {
                              return (
                                Number(sb[label]) ||
                                Number(sb[label.replaceAll(" ", "_")]) ||
                                0
                              );
                            }
                            return 0;
                          };

                          const basic = pick("Basic Salary");
                          const functional = pick("Functional Allowance");
                          const operational = pick("Operational Allowance");

                          const annualFromCtc = Number(doc.ctc ?? 0);
                          const monthlyFromCtc = annualFromCtc
                            ? annualFromCtc / 12
                            : 0;

                          const monthlyTotal =
                            basic + functional + operational || monthlyFromCtc;
                          const annualCtc = monthlyTotal * 12 || annualFromCtc;

                          return generateOfferLetterHtml({
                            name: doc.candidate_name,
                            position: doc.position,
                            joiningDate: format(
                              new Date(doc.joining_date),
                              "MMMM dd, yyyy"
                            ),
                            basic,
                            functional,
                            operational,
                            monthlyTotal,
                            annualCtc,
                          });
                        }}
                      >
                        {/* Child content = your original look */}
                        <div className="flex w-full items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Export Pdf
                        </div>
                      </PdfConvertor>
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

export default OfferLetterLog;
