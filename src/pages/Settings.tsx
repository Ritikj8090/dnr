import { motion, type Variants } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Check,
  Moon,
  Sun,
  Leaf,
  Heart,
  Zap,
  Cloud,
  FlaskRound,
  Globe,
  Flag,
  Banknote,
  Calendar,
  Clock,
  Grape,
  CoinsIcon,
  ArrowLeftRight,
  Pen,
} from "lucide-react";
import { useTheme } from "@/components/customer-theme";
import PageHeader from "@/components/PageHeader";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { countryData } from "@/constant";
import { AdvancedSelect } from "@/components/ui/advance-select";
import type { Country } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const generalSchema = z.object({
  vat: z.number(),
});

const themeIcons = {
  light: <Zap className="w-5 h-5" />,
  dark: <Moon className="w-5 h-5 text-black" />,
  "yellow-light": <Sun className="w-5 h-5" />,
  "green-light": <Leaf className="w-5 h-5" />,
  "red-light": <Heart className="w-5 h-5" />,
  "blue-light": <Cloud className="w-5 h-5" />,
  "orange-light": <FlaskRound className="w-5 h-5" />,
  "purple-light": <Grape className="w-5 h-5" />,
  "yellow-dark": <Sun className="w-5 h-5" />,
  "green-dark": <Leaf className="w-5 h-5" />,
  "red-dark": <Heart className="w-5 h-5" />,
  "blue-dark": <Cloud className="w-5 h-5" />,
  "orange-dark": <FlaskRound className="w-5 h-5" />,
  "purple-dark": <Grape className="w-5 h-5" />,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Settings() {
  const storedCountry = localStorage.getItem("selectedCountry");
  const { currentTheme, themes, setTheme } = useTheme();
  const [isGeneralOpen, setIsGeneralOpen] = useState(false);
  const [country, setCountry] = useState<Country>(
    storedCountry
      ? (JSON.parse(storedCountry) as Country)
      : {
          value: "ae",
          label: "United Arab Emirates",
          flag: "🇦🇪",
          currency: { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
          phoneCode: "+971",
          timezone: "Asia/Dubai",
          dateFormat: "dd/MM/yyyy",
          region: "Middle East",
          continent: "Asia",
        }
  );
  const local = localStorage.getItem("general");

  const general = useForm<z.infer<typeof generalSchema>>({
    resolver: zodResolver(generalSchema),
    defaultValues: local
      ? JSON.parse(local)
      : {
          vat: 5,
        },
  });

  function onSubmit(values: z.infer<typeof generalSchema>) {
    setIsGeneralOpen(false);
    console.log(values);
    localStorage.setItem("general", JSON.stringify(values));
  }

  const countryOptions = countryData.map((country) => ({
    value: country.value,
    label: country.label,
    description: `${country.region} • ${country.phoneCode}`,
    category: country.continent,
    metadata: {
      flag: country.flag,
      phoneCode: country.phoneCode,
      currency: country.currency,
    },
  }));

  const handleCountryChange = (countryValue: string) => {
    const country = countryData.find((c) => c.value === countryValue);
    console.log("Selected country:", country);
    if (country) {
      const selectedCountry = {
        value: country.value,
        label: country.label,
        flag: country.flag,
        currency: country.currency,
        phoneCode: country.phoneCode,
        timezone: country.timezone[0],
        dateFormat: country.dateFormat,
        region: country.region,
        continent: country.continent,
      };
      // Set state
      setCountry(selectedCountry);

      // Store in localStorage
      localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
    }
  };

  const currencyOptions = Array.from(
    new Map(
      countryData.map((country) => [country.currency.code, country.currency])
    ).values()
  ).map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
    description: `Symbol: ${currency.symbol}`,
    category: "Currency",
  }));

  const timezoneOptions = countryData
    .flatMap((country) => country.timezone)
    .filter((timezone, index, array) => array.indexOf(timezone) === index)
    .map((timezone) => ({
      value: timezone,
      label: timezone.replace(/_/g, " ").replace("/", " / "),
      description: `UTC offset varies`,
      category: "Timezone",
    }));

  const dateFormatOptions = [
    { value: "MM/dd/yyyy", label: "MM/DD/YYYY", description: "Month/Day/Year" },
    { value: "dd/MM/yyyy", label: "DD/MM/YYYY", description: "Day/Month/Year" },
    { value: "yyy/MM/dd", label: "YYYY/MM/DD", description: "Year/Month/Day" },
    { value: "MM-dd-yyyy", label: "MM-DD-YYYY", description: "Month-Day-Year" },
    { value: "dd-MM-yyyy", label: "DD-MM-YYYY", description: "Day-Month-Year" },
    { value: "yyy-MM-dd", label: "YYYY-MM-DD", description: "Year-Month-Day" },
    {
      value: "MMMM dd, yyyy",
      label: "MMMM dd, yyyy",
      description: "August 02, 2025",
    },
  ].map((format) => ({
    value: format.value,
    label: format.label,
    description: format.description,
    category: "Date Format",
  }));

  const defaultCountrySettings = [
    {
      label: "Currency",
      value: country.currency.symbol + " " + country.currency.code,
      description: country.currency.name,
      icon: Banknote,
    },
    {
      label: "Phone Code",
      value: country.phoneCode,
      description: country.label,
      icon: Flag,
    },
    {
      label: "Date Format",
      value: country.dateFormat.toUpperCase(),
      description: country.label,
      icon: Calendar,
    },
    {
      label: "Timezone",
      value: country.timezone,
      description: country.region,
      icon: Clock,
    },
  ];

  const defaultGeneralSettings = [
    {
      label: "VAT",
      description: "",
      value: general.getValues("vat"),
      icon: CoinsIcon,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-6 py-8 max-w-[110rem] relative z-10 space-y-4"
      >
        <PageHeader title="Settings" description="Choose your theme" />
        <Card className=" relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <ArrowLeftRight className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">General Settings</h1>
                  <p className="text-muted-foreground">
                    Configure general-specific settings for your application
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className=" space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {defaultGeneralSettings.map((setting) => (
                <Card key={setting.label}>
                  <CardHeader className="flex items-center gap-2 flex-col text-center">
                    <CardDescription>
                      <span className="flex items-center justify-center">
                        {React.createElement(setting.icon, {
                          className: "w-6 h-6 text-primary",
                        })}
                      </span>
                      <span className="block">{setting.label}</span>
                    </CardDescription>
                    <CardTitle>{setting.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
          <Button
            className="absolute right-2 top-2 p-1 text-muted-foreground"
            variant={"ghost"}
            onClick={() => setIsGeneralOpen(true)}
          >
            <Pen />
          </Button>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Globe className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Country & Regional Settings
                  </h1>
                  <p className="text-muted-foreground">
                    Configure country-specific settings for your application
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className=" space-y-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-primary" />
                Primary Country
              </Label>
              <AdvancedSelect
                options={countryOptions}
                value={country.value}
                onChange={(value) => handleCountryChange(value as string)}
                placeholder="Select your country..."
                searchable={true}
                clearable={false}
                groupBy="category"
                showCategories={true}
                showIcons={false}
                showDescriptions={true}
              />
            </div>
            <Card>
              <CardHeader className="flex items-start gap-2">
                <div className=" text-2xl">{country.flag}</div>
                <div>
                  <CardTitle>{country.label}</CardTitle>
                  <CardDescription>{country.region}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultCountrySettings.map((setting) => (
                  <Card key={setting.label}>
                    <CardHeader className="flex items-center gap-2 flex-col text-center">
                      <CardDescription>
                        <span className="flex items-center justify-center">
                          {React.createElement(setting.icon, {
                            className: "w-6 h-6 text-primary",
                          })}
                        </span>
                        <span className="block">{setting.label}</span>
                      </CardDescription>
                      <CardTitle>{setting.value}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                Currency
              </Label>
              <AdvancedSelect
                options={currencyOptions}
                value={country.currency.code}
                onChange={(value) => {
                  const selectedCurrency = countryData.find(
                    (c) => c.currency.code === value
                  );
                  if (selectedCurrency) {
                    setCountry((prev) => {
                      const updatedCountry = {
                        ...prev,
                        currency: selectedCurrency.currency,
                      };

                      // Also update localStorage
                      localStorage.setItem(
                        "selectedCountry",
                        JSON.stringify(updatedCountry)
                      );

                      return updatedCountry;
                    });
                  }
                }}
                placeholder="Select currency..."
                searchable={true}
                clearable={false}
                showIcons={false}
                showDescriptions={true}
              />
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Timezone
              </Label>
              <AdvancedSelect
                options={timezoneOptions}
                value={country.timezone}
                onChange={(value) => {
                  setCountry((prev) => {
                    const updatedCountry = {
                      ...prev,
                      timezone: value as string,
                    };

                    // Update localStorage
                    localStorage.setItem(
                      "selectedCountry",
                      JSON.stringify(updatedCountry)
                    );

                    return updatedCountry;
                  });
                }}
                placeholder="Select timezone..."
                searchable={true}
                clearable={false}
                showIcons={false}
                showDescriptions={true}
              />
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Date Format
              </Label>
              <AdvancedSelect
                options={dateFormatOptions}
                value={country.dateFormat}
                onChange={(value) => {
                  setCountry((prev) => {
                    const updatedCountry = {
                      ...prev,
                      dateFormat: value as string,
                    };

                    // Sync with localStorage
                    localStorage.setItem(
                      "selectedCountry",
                      JSON.stringify(updatedCountry)
                    );

                    return updatedCountry;
                  });
                }}
                placeholder="Select date format..."
                searchable={false}
                clearable={false}
                showIcons={false}
                showDescriptions={true}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Palette className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Global Theme Selector</h1>
                  <p className="text-muted-foreground">
                    Choose your perfect color theme for the entire app
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/70 text-accent-foreground"
              >
                {currentTheme.name}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  currentTheme.id === theme.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setTheme(theme.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 rounded-lg text-white bg-primary"
                        style={{
                          backgroundColor: `${theme.colors.primary}`,
                        }}
                      >
                        {themeIcons[theme.id as keyof typeof themeIcons]}
                      </div>
                      <div>
                        <CardTitle>{theme.name}</CardTitle>
                      </div>
                    </div>
                    {currentTheme.id === theme.id && (
                      <div className="p-1 rounded-full bg-primary">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Color Palette Preview */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div
                        className="flex-1 h-8 rounded"
                        style={{ backgroundColor: `${theme.colors.primary}` }}
                      />
                      <div
                        className="flex-1 h-8 rounded"
                        style={{
                          backgroundColor: `${theme.colors.primaryForeground}`,
                        }}
                      />
                      <div
                        className="flex-1 h-8 rounded"
                        style={{
                          backgroundColor: `${theme.colors.mutedForeground}`,
                        }}
                      />
                    </div>

                    {/* Sample UI Elements */}
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={
                      currentTheme.id === theme.id ? "default" : "secondary"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(theme.id);
                    }}
                  >
                    {currentTheme.id === theme.id ? "Selected" : "Select Theme"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </motion.div>
      <Dialog open={isGeneralOpen} onOpenChange={setIsGeneralOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit General Settings</DialogTitle>
            <DialogDescription>Change configration</DialogDescription>
          </DialogHeader>
          <Form {...general}>
            <form
              onSubmit={general.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={general.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT (In Percentage)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={"0"}
                        max={"100"}
                        step={"1"}
                        placeholder="Enter VAT"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className=" w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
