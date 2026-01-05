import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ChevronDown,
  Search,
  X,
  Plus,
  type LucideProps,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color?: string;
  category?: string;
  disabled?: boolean;
  featured?: boolean;
  metadata?: {
    flag: string;
    phoneCode: string;
    currency: {
      code: string;
      symbol: string;
      name: string;
    };
  };
}

interface AdvancedSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  groupBy?: string;
  maxHeight?: number;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showIcons?: boolean;
  showDescriptions?: boolean;
  showCategories?: boolean;
  customFilter?: (option: SelectOption, searchTerm: string) => boolean;
  onCreateOption?: (inputValue: string) => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  renderValue?: (option: SelectOption) => React.ReactNode;
}

export function AdvancedSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchable = true,
  multiple = false,
  clearable = true,
  creatable = false,
  groupBy,
  maxHeight = 300,
  disabled = false,
  loading = false,
  error,
  size = "md",
  variant = "default",
  showIcons = true,
  showDescriptions = true,
  showCategories = true,
  customFilter,
  onCreateOption,
  renderValue,
}: AdvancedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Get selected options
  const selectedOptions = Array.isArray(value)
    ? options.filter((opt) => value.includes(opt.value))
    : options.filter((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((option) => {
    if (customFilter) {
      return customFilter(option, searchTerm);
    }

    const searchLower = searchTerm.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.description?.toLowerCase().includes(searchLower) ||
      option.category?.toLowerCase().includes(searchLower)
    );
  });

  // Group options by category if specified
  const groupedOptions =
    groupBy && showCategories
      ? filteredOptions.reduce((groups, option) => {
          const group =
            (option[groupBy as keyof SelectOption] as string) || "Other";
          if (!groups[group]) groups[group] = [];
          groups[group].push(option);
          return groups;
        }, {} as Record<string, SelectOption[]>)
      : { All: filteredOptions };

  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    console.log("Selected option:", option);

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange(newValues);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : "");
    setSearchTerm("");
  };

  // Handle create new option
  const handleCreate = () => {
    if (onCreateOption && searchTerm.trim()) {
      onCreateOption(searchTerm.trim());
      setSearchTerm("");
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case "Backspace":
        if (multiple && !searchTerm && selectedOptions.length > 0) {
          const newValues = (value as string[]).slice(0, -1);
          onChange(newValues);
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 text-sm";
      case "lg":
        return "h-12 text-lg";
      default:
        return "h-10";
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border-2 border-white/20 bg-white/5 hover:bg-white/10";
      case "ghost":
        return "border-0 bg-transparent hover:bg-white/5";
      default:
        return "border";
    }
  };

  const renderCountryOption = (option: SelectOption) => (
    <div className="flex items-center gap-3">
      <div className="text-2xl">{option.metadata?.flag}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{option.label}</span>
        </div>
        <p className="text-muted-foreground text-sm mt-1 truncate">
          {option.description}
        </p>
      </div>
      <div className="text-muted-foreground text-sm font-mono">
        {option.metadata?.phoneCode}
      </div>
    </div>
  );

  return (
    <div ref={selectRef} className="relative w-full">
      {/* Main Select Button */}
      <motion.div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${error ? "border-red-400" : ""}
          ${isOpen ? "border-primary" : ""}
          flex items-center justify-between px-3 py-2 rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/50
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Selected Values Display */}
          {selectedOptions.length > 0 ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {multiple ? (
                <div className="flex flex-wrap gap-1 max-w-full">
                  {selectedOptions.slice(0, 3).map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="text-xs"
                    >
                      {showIcons && option.icon && (
                        <option.icon className="h-3 w-3 mr-1" />
                      )}
                      {option.label}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newValues = (value as string[]).filter(
                            (v) => v !== option.value
                          );
                          onChange(newValues);
                        }}
                        className="h-3 w-3 p-0 ml-1 "
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedOptions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedOptions.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 truncate">
                  {showIcons &&
                    selectedOptions[0].icon &&
                    (() => {
                      const IconComponent = selectedOptions[0].icon;
                      return (
                        <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                      );
                    })()}
                  <span className="truncate">
                    {renderValue
                      ? renderValue(selectedOptions[0])
                      : selectedOptions[0].label}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-4 h-4 border-2 border-t rounded-full"
            />
          )}

          {clearable && selectedOptions.length > 0 && !loading && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="h-5 w-5 p-0 "
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground0" />
          </motion.div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card>
              <CardContent className="p-0">
                {/* Search Input */}
                {searchable && (
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={searchRef}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search options..."
                        className="pl-10 placeholder:text-muted-foreground "
                      />
                    </div>
                  </div>
                )}

                {/* Options List */}
                <div
                  ref={optionsRef}
                  className="max-h-64 overflow-y-auto"
                  style={{ maxHeight }}
                >
                  {Object.entries(groupedOptions).map(
                    ([groupName, groupOptions]) => (
                      <div key={groupName}>
                        {/* Group Header */}
                        {showCategories && groupName !== "All" && (
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b ">
                            {groupName}
                          </div>
                        )}

                        {/* Group Options */}
                        {groupOptions.map((option) => {
                          const isSelected = Array.isArray(value)
                            ? value.includes(option.value)
                            : value === option.value;
                          return (
                            <motion.div
                              key={option.value}
                              onClick={() => handleSelect(option)}
                              className={`
                              px-3 py-3 cursor-pointer
                              ${
                                isSelected
                                  ? "bg-primary/20 border-r-2 border-primary"
                                  : " hover:bg-primary-foreground/40"
                              }
                            `}
                            >
                              {renderCountryOption ? (
                                renderCountryOption(option)
                              ) : (
                                <div className="flex items-center gap-3">
                                  {/* Option Icon */}
                                  {showIcons && option.icon && (
                                    <div
                                      className={`p-2 rounded-lg bg-gradient-to-r ${
                                        option.color ||
                                        "from-gray-500 to-slate-500"
                                      } shadow-lg flex-shrink-0`}
                                    >
                                      <option.icon className="h-4 w-4 text-white" />
                                    </div>
                                  )}

                                  {/* Option Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className=" font-medium truncate">
                                        {option.label}
                                      </span>
                                      {option.featured && (
                                        <Badge
                                          variant="secondary"
                                          className="bg-yellow-500/20 text-yellow-200 text-xs"
                                        >
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                    {showDescriptions && option.description && (
                                      <p className="text-muted-foreground text-sm mt-1 truncate">
                                        {option.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Selection Indicator */}
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex-shrink-0"
                                    >
                                      <Check className="h-4 w-4 text-primary" />
                                    </motion.div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )
                  )}

                  {/* No Options Found */}
                  {filteredOptions.length === 0 && (
                    <div className="px-3 py-8 text-center">
                      <div className="text-white/50 mb-2">No options found</div>
                      {creatable && searchTerm && (
                        <Button
                          onClick={handleCreate}
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Create "{searchTerm}"
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Create Option */}
                  {creatable && searchTerm && filteredOptions.length > 0 && (
                    <>
                      <Separator className="bg-white/10" />
                      <motion.div
                        whileHover={{
                          x: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                        onClick={handleCreate}
                        className="px-3 py-3 cursor-pointer hover:bg-white/10 transition-all duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                            <Plus className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white font-medium">
                              Create "{searchTerm}"
                            </span>
                            <p className="text-white/60 text-sm">
                              Add as new option
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
