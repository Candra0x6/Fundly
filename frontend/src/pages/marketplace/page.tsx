"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NFTCard from "@/components/nft-card";
import ActiveFilters from "@/components/active-filters";
import MarketplaceHeader from "@/components/marketplace-header";

interface NFT {
  id: string;
  title: string;
  company: string;
  price: string;
  returnRate: string;
  timeframe: string;
  raised: string;
  image: string;
  industry: string;
  location: string;
  verified: boolean;
}

interface FilterItem {
  id: string;
  category: string;
  value: string;
}

export default function MarketplacePage() {
  // Sample NFT data
  const nfts = [
    {
      id: "1",
      title: "GreenTech Q3 Revenue Share",
      company: "GreenTech Solutions",
      price: "5,000 FND",
      returnRate: "12-15%",
      timeframe: "Quarterly",
      raised: "75%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Renewable Energy",
      location: "Singapore",
      verified: true,
    },
    {
      id: "2",
      title: "Harvest Season Revenue",
      company: "Organic Harvest Co.",
      price: "3,500 FND",
      returnRate: "8-10%",
      timeframe: "Bi-annual",
      raised: "60%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Agriculture",
      location: "Indonesia",
      verified: true,
    },
    {
      id: "3",
      title: "EdTech Platform Expansion",
      company: "EduTech Innovations",
      price: "7,500 FND",
      returnRate: "15-18%",
      timeframe: "Annual",
      raised: "40%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Education",
      location: "Philippines",
      verified: true,
    },
    {
      id: "4",
      title: "Healthcare App Development",
      company: "MediTech Solutions",
      price: "6,200 FND",
      returnRate: "10-12%",
      timeframe: "Quarterly",
      raised: "55%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Healthcare",
      location: "Thailand",
      verified: true,
    },
    {
      id: "5",
      title: "Sustainable Fashion Line",
      company: "EcoWear Designs",
      price: "4,800 FND",
      returnRate: "9-11%",
      timeframe: "Bi-annual",
      raised: "65%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Fashion",
      location: "Vietnam",
      verified: true,
    },
    {
      id: "6",
      title: "Local Food Delivery Network",
      company: "FoodConnect",
      price: "3,200 FND",
      returnRate: "11-14%",
      timeframe: "Quarterly",
      raised: "80%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Food & Beverage",
      location: "Malaysia",
      verified: true,
    },
    {
      id: "7",
      title: "Eco-Tourism Expansion",
      company: "NatureTrek Adventures",
      price: "5,500 FND",
      returnRate: "13-16%",
      timeframe: "Annual",
      raised: "45%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Tourism",
      location: "Indonesia",
      verified: true,
    },
    {
      id: "8",
      title: "Fintech Payment Solution",
      company: "PayEase",
      price: "8,000 FND",
      returnRate: "14-17%",
      timeframe: "Quarterly",
      raised: "35%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Fintech",
      location: "Singapore",
      verified: true,
    },
    {
      id: "9",
      title: "Artisanal Craft Marketplace",
      company: "CraftConnect",
      price: "2,800 FND",
      returnRate: "7-9%",
      timeframe: "Bi-annual",
      raised: "70%",
      image: "/placeholder.svg?height=200&width=300",
      industry: "Handicrafts",
      location: "Philippines",
      verified: true,
    },
  ];

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>(nfts);
  const [showFilters, setShowFilters] = useState(false);

  // Industry filter state
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([
    "All Industries",
  ]);
  // Return rate filter state
  const [selectedReturns, setSelectedReturns] = useState<string[]>([
    "10% - 15%",
  ]);
  // Price range filter state
  const [selectedPrices, setSelectedPrices] = useState<string[]>([
    "1,000 - 5,000 FND",
  ]);
  // Distribution frequency filter state
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([
    "Monthly",
    "Quarterly",
  ]);

  // Sample industries for filter
  const industries = [
    "All Industries",
    "Agriculture",
    "Education",
    "Fashion",
    "Fintech",
    "Food & Beverage",
    "Handicrafts",
    "Healthcare",
    "Renewable Energy",
    "Tourism",
  ];

  // Apply filters and search
  useEffect(() => {
    let results = [...nfts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (nft) =>
          nft.title.toLowerCase().includes(query) ||
          nft.company.toLowerCase().includes(query) ||
          nft.industry.toLowerCase().includes(query)
      );
    }

    // Apply industry filter (if not "All Industries")
    if (
      activeFilters.some(
        (filter) =>
          filter.category === "Industry" && filter.value !== "All Industries"
      )
    ) {
      const industryValues = activeFilters
        .filter((filter) => filter.category === "Industry")
        .map((filter) => filter.value);

      results = results.filter((nft) => industryValues.includes(nft.industry));
    }

    // Apply return rate filter
    if (activeFilters.some((filter) => filter.category === "Return")) {
      const returnValues = activeFilters
        .filter((filter) => filter.category === "Return")
        .map((filter) => filter.value);

      results = results.filter((nft) => {
        const [min, max] = nft.returnRate
          .split("-")
          .map((r) => parseInt(r.trim().replace("%", "")));

        return returnValues.some((range) => {
          const [rangeMin, rangeMax] = range
            .split("-")
            .map((r) => parseInt(r.trim().replace("%", "")));
          return min >= rangeMin && max <= rangeMax;
        });
      });
    }

    // Apply price filter
    if (activeFilters.some((filter) => filter.category === "Price")) {
      const priceValues = activeFilters
        .filter((filter) => filter.category === "Price")
        .map((filter) => filter.value);

      results = results.filter((nft) => {
        const nftPrice = parseInt(nft.price.replace(/[^\d]/g, ""));

        return priceValues.some((range) => {
          if (range.includes("Under")) {
            const threshold = parseInt(range.replace(/[^\d]/g, ""));
            return nftPrice < threshold;
          } else if (range.includes("Over")) {
            const threshold = parseInt(range.replace(/[^\d]/g, ""));
            return nftPrice > threshold;
          } else {
            const [rangeMin, rangeMax] = range
              .split("-")
              .map((p) => parseInt(p.trim().replace(/[^\d]/g, "")));
            return nftPrice >= rangeMin && nftPrice <= rangeMax;
          }
        });
      });
    }

    // Apply distribution frequency filter
    if (activeFilters.some((filter) => filter.category === "Distribution")) {
      const frequencyValues = activeFilters
        .filter((filter) => filter.category === "Distribution")
        .map((filter) => filter.value);

      results = results.filter((nft) =>
        frequencyValues.includes(nft.timeframe)
      );
    }

    setFilteredNfts(results);
  }, [searchQuery, activeFilters, nfts]);

  // Add a filter
  const addFilter = (category: string, value: string) => {
    const newFilter: FilterItem = {
      id: `${category}-${value}`,
      category,
      value,
    };

    // Don't add duplicate filters
    if (!activeFilters.some((filter) => filter.id === newFilter.id)) {
      setActiveFilters([...activeFilters, newFilter]);
    }
  };

  // Remove a filter
  const removeFilter = (id: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== id));
  };

  // Clear all filters and search
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setSelectedIndustries(["All Industries"]);
    setSelectedReturns([]);
    setSelectedPrices([]);
    setSelectedFrequencies([]);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle industry checkbox changes
  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (industry === "All Industries" && checked) {
      // If "All Industries" is selected, remove other industry filters
      setSelectedIndustries(["All Industries"]);
      setActiveFilters(
        activeFilters.filter((filter) => filter.category !== "Industry")
      );
    } else if (checked) {
      // If another industry is selected, remove "All Industries"
      const newSelected = selectedIndustries
        .filter((i) => i !== "All Industries")
        .concat(industry);
      setSelectedIndustries(newSelected);

      // Remove previous industry filters and add new ones
      const nonIndustryFilters = activeFilters.filter(
        (filter) => filter.category !== "Industry"
      );
      const industryFilters = newSelected.map((ind) => ({
        id: `Industry-${ind}`,
        category: "Industry",
        value: ind,
      }));

      setActiveFilters([...nonIndustryFilters, ...industryFilters]);
    } else {
      // If unchecking an industry
      const newSelected = selectedIndustries.filter((i) => i !== industry);
      setSelectedIndustries(
        newSelected.length ? newSelected : ["All Industries"]
      );

      // Update active filters
      setActiveFilters(
        activeFilters.filter((filter) => filter.id !== `Industry-${industry}`)
      );
    }
  };

  // Handle return rate checkbox changes
  const handleReturnChange = (returnRange: string, checked: boolean) => {
    if (checked) {
      setSelectedReturns([...selectedReturns, returnRange]);
      addFilter("Return", returnRange);
    } else {
      setSelectedReturns(selectedReturns.filter((r) => r !== returnRange));
      removeFilter(`Return-${returnRange}`);
    }
  };

  // Handle price range checkbox changes
  const handlePriceChange = (priceRange: string, checked: boolean) => {
    if (checked) {
      setSelectedPrices([...selectedPrices, priceRange]);
      addFilter("Price", priceRange);
    } else {
      setSelectedPrices(selectedPrices.filter((p) => p !== priceRange));
      removeFilter(`Price-${priceRange}`);
    }
  };

  // Handle frequency checkbox changes
  const handleFrequencyChange = (frequency: string, checked: boolean) => {
    if (checked) {
      setSelectedFrequencies([...selectedFrequencies, frequency]);
      addFilter("Distribution", frequency);
    } else {
      setSelectedFrequencies(
        selectedFrequencies.filter((f) => f !== frequency)
      );
      removeFilter(`Distribution-${frequency}`);
    }
  };

  // Apply filter button
  const applyFilters = () => {
    setShowFilters(false);
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-white ">

      {/* Marketplace Header */}
      <MarketplaceHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Search NFTs, MSMEs, or industries..."
              className="pl-10 bg-white border-zinc-200 rounded-xl"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </div>
          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-[180px] bg-white border-zinc-200 rounded-xl">
                <SelectValue placeholder="Sort by: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest-return">Highest Return</SelectItem>
                <SelectItem value="lowest-price">Lowest Price</SelectItem>
                <SelectItem value="highest-price">Highest Price</SelectItem>
                <SelectItem value="most-funded">Most Funded</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-zinc-200 rounded-xl"
              onClick={toggleFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Tabs defaultValue="grid" className="hidden md:block">
              <TabsList className="bg-white border border-zinc-200 rounded-xl">
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-zinc-100 rounded-lg"
                >
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-zinc-100 rounded-lg"
                >
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters
          activeFilters={activeFilters}
          removeFilter={removeFilter}
          clearAllFilters={clearAllFilters}
          searchQuery={searchQuery}
          clearSearch={clearSearch}
        />

        {/* Filter Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`bg-white p-5 rounded-xl border border-zinc-100 shadow-sm ${showFilters ? "block" : "hidden md:block"}`}
          >
            <h3 className="font-medium mb-4">Industries</h3>
            <div className="space-y-2">
              {industries.map((industry, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`industry-${index}`}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedIndustries.includes(industry)}
                    onChange={(e) =>
                      handleIndustryChange(industry, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`industry-${index}`}
                    className="ml-2 text-sm text-zinc-700"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <h3 className="font-medium mb-4">Expected Return</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="return-1"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedReturns.includes("Under 5%")}
                    onChange={(e) =>
                      handleReturnChange("Under 5%", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="return-1"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Under 5%
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="return-2"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedReturns.includes("5% - 10%")}
                    onChange={(e) =>
                      handleReturnChange("5% - 10%", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="return-2"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    5% - 10%
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="return-3"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedReturns.includes("10% - 15%")}
                    onChange={(e) =>
                      handleReturnChange("10% - 15%", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="return-3"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    10% - 15%
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="return-4"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedReturns.includes("15% - 20%")}
                    onChange={(e) =>
                      handleReturnChange("15% - 20%", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="return-4"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    15% - 20%
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="return-5"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedReturns.includes("Over 20%")}
                    onChange={(e) =>
                      handleReturnChange("Over 20%", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="return-5"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Over 20%
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-1"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedPrices.includes("Under 1,000 FND")}
                    onChange={(e) =>
                      handlePriceChange("Under 1,000 FND", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="price-1"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Under 1,000 FND
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-2"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedPrices.includes("1,000 - 5,000 FND")}
                    onChange={(e) =>
                      handlePriceChange("1,000 - 5,000 FND", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="price-2"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    1,000 - 5,000 FND
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-3"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedPrices.includes("5,000 - 10,000 FND")}
                    onChange={(e) =>
                      handlePriceChange("5,000 - 10,000 FND", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="price-3"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    5,000 - 10,000 FND
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-4"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedPrices.includes("Over 10,000 FND")}
                    onChange={(e) =>
                      handlePriceChange("Over 10,000 FND", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="price-4"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Over 10,000 FND
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <h3 className="font-medium mb-4">Distribution Frequency</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dist-1"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedFrequencies.includes("Monthly")}
                    onChange={(e) =>
                      handleFrequencyChange("Monthly", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="dist-1"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Monthly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dist-2"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedFrequencies.includes("Quarterly")}
                    onChange={(e) =>
                      handleFrequencyChange("Quarterly", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="dist-2"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Quarterly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dist-3"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedFrequencies.includes("Bi-annual")}
                    onChange={(e) =>
                      handleFrequencyChange("Bi-annual", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="dist-3"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Bi-annual
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dist-4"
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    checked={selectedFrequencies.includes("Annual")}
                    onChange={(e) =>
                      handleFrequencyChange("Annual", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="dist-4"
                    className="ml-2 text-sm text-zinc-700"
                  >
                    Annual
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-sm"
                onClick={clearAllFilters}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-sm"
                onClick={applyFilters}
              >
                Apply
              </Button>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNfts.length > 0 ? (
                filteredNfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-zinc-500">
                    No matching opportunities found. Try adjusting your filters.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredNfts.length > 0 && (
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-zinc-500">
                  Showing{" "}
                  <span className="font-medium">1-{filteredNfts.length}</span>{" "}
                  of <span className="font-medium">{filteredNfts.length}</span>{" "}
                  opportunities
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg bg-emerald-50 border-emerald-200 text-emerald-600"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
