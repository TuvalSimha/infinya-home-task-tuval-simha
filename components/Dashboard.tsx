"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockSalesData } from "@/lib/mockData";
import { Button } from "./ui/button";

export interface Sales {
  SalesID: number;
  Date: string;
  ProductName: string;
  Category: Category;
  Region: Region;
  Quantity: number;
  Revenue: number;
}

interface ComparisonData {
  name: string;
  revenue: number;
  transactions: number;
  averageTransactionValue: number;
}

export type Category = "Books" | "Clothing" | "Electronics" | "Home" | "Toys";
export type Region = "North" | "South" | "East" | "West";

interface RegionRevenue {
  Region: Region;
  Revenue: number;
  fill: string;
}

interface ProductData {
  name: string;
  revenue: number;
  quantity: number;
  category: Category;
}

interface PerformanceData {
  revenue: number;
  transactions: number;
  timeRange: string;
  percentageDiff: number; // Difference from average
}

interface PerformanceMetrics {
  lowestRegion?: [Region, PerformanceData];
  lowestCategory?: [Category, PerformanceData];
}

interface MonthData {
  id: string;
  month: number;
  year?: number;
  display: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ProductData;
  }>;
}

const CustomProductTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 border rounded-lg shadow-lg">
      <p className="font-semibold">{data.name}</p>
      <p className="text-sm text-muted-foreground">Category: {data.category}</p>
      <p className="text-sm">Revenue: ${data.revenue.toLocaleString()}</p>
      <p className="text-sm">Quantity: {data.quantity}</p>
    </div>
  );
};

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>(
    "All",
  );

  const allYearsFromData = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        mockSalesData.map((sale) => {
          const date = new Date(sale.Date);
          return date.getFullYear().toString();
        }),
      ),
    )
      .filter((year) => year !== "NaN")
      .sort();
  }, []);

  const displayedMonths = useMemo<MonthData[]>(() => {
    if (selectedYear === "All") {
      // For 'All' years: Show unique month-year combinations from data
      const monthsSet = new Set<string>();
      const monthsData: MonthData[] = [];

      mockSalesData.forEach((sale) => {
        const date = new Date(sale.Date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const monthId = `${month.toString().padStart(2, "0")}-${year}`;

        if (!monthsSet.has(monthId) && !isNaN(year)) {
          monthsSet.add(monthId);
          monthsData.push({
            id: monthId,
            month,
            year,
            display: `${date.toLocaleString("default", {
              month: "long",
            })} ${year}`,
          });
        }
      });

      return monthsData.sort((a, b) => {
        if (a.year !== b.year) return a.year! - b.year!;
        return a.month - b.month;
      });
    } else {
      // For specific year: Show all 12 months
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return months.map((monthName, index) => ({
        id: (index + 1).toString().padStart(2, "0"),
        month: index + 1,
        display: monthName,
      }));
    }
  }, [selectedYear, mockSalesData]);

  const allCategoriesFromData = useMemo<Category[]>(() => {
    return Array.from(
      new Set(mockSalesData.map((sale) => sale.Category)),
    ) as Category[];
  }, []);

  // Reset month selection when year changes
  useEffect(() => {
    setSelectedMonth("All");
  }, [selectedYear]);

  const filteredData = useMemo<Sales[]>(() => {
    return mockSalesData
      .filter((sale) => {
        const saleDate = new Date(sale.Date);
        const saleYear = saleDate.getFullYear().toString();
        const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, "0");

        const monthMatches =
          selectedMonth === "All" ||
          (selectedYear === "All"
            ? selectedMonth === `${saleMonth}-${saleYear}` // Include year in comparison
            : selectedMonth === saleMonth); // Just compare month numbers

        return (
          (selectedYear === "All" || saleYear === selectedYear) &&
          monthMatches &&
          (selectedCategory === "All" || sale.Category === selectedCategory)
        );
      })
      .map((sale) => ({
        ...sale,
        Category: sale.Category as Category,
        Region: sale.Region as Region,
      }));
  }, [selectedYear, selectedMonth, selectedCategory]);

  const revenueByRegion = useMemo<RegionRevenue[]>(() => {
    const data = filteredData.reduce<Record<Region, number>>(
      (acc, sale) => {
        acc[sale.Region] = (acc[sale.Region] || 0) + sale.Revenue;
        return acc;
      },
      {} as Record<Region, number>,
    );

    return Object.entries(data).map(([Region, Revenue], index) => ({
      Region: Region as Region,
      Revenue,
      fill: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
    }));
  }, [filteredData]);

  const topProducts = useMemo<ProductData[]>(() => {
    const productData = filteredData.reduce<Record<string, ProductData>>(
      (acc, sale) => {
        if (!acc[sale.ProductName]) {
          acc[sale.ProductName] = {
            name: sale.ProductName,
            revenue: 0,
            quantity: 0,
            category: sale.Category,
          };
        }
        acc[sale.ProductName].revenue += sale.Revenue;
        acc[sale.ProductName].quantity += sale.Quantity;
        return acc;
      },
      {},
    );

    return Object.values(productData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredData]);

  const performanceMetrics = useMemo<PerformanceMetrics>(() => {
    // Generate time range string based on filters
    const timeRange =
      selectedYear === "All"
        ? "All Time"
        : selectedMonth === "All"
          ? `Year ${selectedYear}`
          : `${new Date(2024, parseInt(selectedMonth) - 1).toLocaleString(
              "default",
              { month: "long" },
            )} ${selectedYear}`;

    const regionPerformance = filteredData.reduce<
      Record<Region, PerformanceData>
    >(
      (acc, sale) => {
        if (!acc[sale.Region]) {
          acc[sale.Region] = {
            revenue: 0,
            transactions: 0,
            timeRange,
            percentageDiff: 0,
          };
        }
        acc[sale.Region].revenue += sale.Revenue;
        acc[sale.Region].transactions += 1;
        return acc;
      },
      {} as Record<Region, PerformanceData>,
    );

    // Calculate average revenue for comparison
    const regionValues = Object.values(regionPerformance);
    const avgRegionRevenue =
      regionValues.reduce((sum, curr) => sum + curr.revenue, 0) /
      regionValues.length;

    // Add percentage difference from average
    Object.values(regionPerformance).forEach((region) => {
      region.percentageDiff =
        ((region.revenue - avgRegionRevenue) / avgRegionRevenue) * 100;
    });
    const categoryPerformance = filteredData.reduce<
      Record<Category, PerformanceData>
    >(
      (acc, sale) => {
        if (!acc[sale.Category]) {
          acc[sale.Category] = {
            revenue: 0,
            transactions: 0,
            timeRange,
            percentageDiff: 0,
          };
        }
        acc[sale.Category].revenue += sale.Revenue;
        acc[sale.Category].transactions += 1;
        return acc;
      },
      {} as Record<Category, PerformanceData>,
    );

    const categoryValues = Object.values(categoryPerformance);
    const avgCategoryRevenue =
      categoryValues.reduce((sum, curr) => sum + curr.revenue, 0) /
      categoryValues.length;

    Object.values(categoryPerformance).forEach((category) => {
      category.percentageDiff =
        ((category.revenue - avgCategoryRevenue) / avgCategoryRevenue) * 100;
    });

    const regionEntries = Object.entries(regionPerformance) as [
      Region,
      PerformanceData,
    ][];
    const categoryEntries = Object.entries(categoryPerformance) as [
      Category,
      PerformanceData,
    ][];

    return {
      lowestRegion: regionEntries.sort(
        (a, b) => a[1].revenue - b[1].revenue,
      )[0],
      lowestCategory: categoryEntries.sort(
        (a, b) => a[1].revenue - b[1].revenue,
      )[0],
    };
  }, [filteredData, selectedYear, selectedMonth]);

  const regionComparison = useMemo<ComparisonData[]>(() => {
    const data = filteredData.reduce<Record<Region, ComparisonData>>(
      (acc, sale) => {
        if (!acc[sale.Region]) {
          acc[sale.Region] = {
            name: sale.Region,
            revenue: 0,
            transactions: 0,
            averageTransactionValue: 0,
          };
        }
        acc[sale.Region].revenue += sale.Revenue;
        acc[sale.Region].transactions += 1;
        return acc;
      },
      {} as Record<Region, ComparisonData>,
    );

    return Object.values(data)
      .map((region) => ({
        ...region,
        averageTransactionValue: region.revenue / region.transactions,
      }))
      .sort((a, b) => a.revenue - b.revenue);
  }, [filteredData]);

  const categoryComparison = useMemo<ComparisonData[]>(() => {
    const data = filteredData.reduce<Record<Category, ComparisonData>>(
      (acc, sale) => {
        if (!acc[sale.Category]) {
          acc[sale.Category] = {
            name: sale.Category,
            revenue: 0,
            transactions: 0,
            averageTransactionValue: 0,
          };
        }
        acc[sale.Category].revenue += sale.Revenue;
        acc[sale.Category].transactions += 1;
        return acc;
      },
      {} as Record<Category, ComparisonData>,
    );

    return Object.values(data)
      .map((category) => ({
        ...category,
        averageTransactionValue: category.revenue / category.transactions,
      }))
      .sort((a, b) => a.revenue - b.revenue);
  }, [filteredData]);

  return (
    <div className="container mx-auto p-4">
      <div className="sticky top-0 bg-white z-10 pb-4">
        <h1 className="text-3xl font-bold mb-4 pt-4">Dashboard</h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <Select
            onValueChange={(value) => {
              setSelectedYear(value);
              setSelectedMonth("All");
            }}
            value={selectedYear}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Years</SelectItem>
              {allYearsFromData.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedMonth} value={selectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Months</SelectItem>
              {displayedMonths.map((monthData) => (
                <SelectItem key={monthData.id} value={monthData.id}>
                  {monthData.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setSelectedCategory(value as "All" | Category)
            }
            value={selectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {allCategoriesFromData.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center">
            <Button
              onClick={() => {
                setSelectedYear("All");
                setSelectedMonth("All");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={revenueByRegion}
                  dataKey="Revenue"
                  nameKey="Region"
                  stroke="0"
                  outerRadius="80%"
                  label={({ Region, Revenue }) =>
                    `${Region}: $${Revenue.toLocaleString()}`
                  }
                >
                  {revenueByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<CustomProductTooltip />} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue">
                  {topProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#FF6384", // Red
                          "#36A2EB", // Blue
                          "#FFCE56", // Yellow
                          "#4BC0C0", // Teal
                          "#9966FF", // Purple
                        ][index % 5]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                      ][index % 5],
                    }}
                  />
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">
                    ({product.category})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>Areas for Improvement</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                {performanceMetrics.lowestRegion && (
                  <p className="mb-2">
                    • Region{" "}
                    <strong>{performanceMetrics.lowestRegion[0]}</strong> shows
                    lower performance with revenue of $
                    {performanceMetrics.lowestRegion[1].revenue.toLocaleString()}
                  </p>
                )}
                {performanceMetrics.lowestCategory && (
                  <p className="mb-2">
                    • Category{" "}
                    <strong>{performanceMetrics.lowestCategory[0]}</strong>{" "}
                    needs attention with revenue of $
                    {performanceMetrics.lowestCategory[1].revenue.toLocaleString()}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Region Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={regionComparison}
                  layout="vertical"
                  margin={{ left: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue">
                    {regionComparison.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === performanceMetrics.lowestRegion?.[0]
                            ? "#FF6384"
                            : "#8884d8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Category Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={categoryComparison}
                  layout="vertical"
                  margin={{ left: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue">
                    {categoryComparison.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === performanceMetrics.lowestCategory?.[0]
                            ? "#FF6384"
                            : "#8884d8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Alert className="mb-4">
              <AlertTitle>Areas for Improvement</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  {performanceMetrics.lowestRegion && (
                    <p className="mb-2">
                      • Region{" "}
                      <strong>{performanceMetrics.lowestRegion[0]}</strong>{" "}
                      shows lower performance for{" "}
                      <strong>
                        {performanceMetrics.lowestRegion[1].timeRange}
                      </strong>{" "}
                      with revenue of $
                      {performanceMetrics.lowestRegion[1].revenue.toLocaleString()}{" "}
                      (
                      {performanceMetrics.lowestRegion[1].percentageDiff.toFixed(
                        1,
                      )}
                      % below average)
                    </p>
                  )}
                  {performanceMetrics.lowestCategory && (
                    <p className="mb-2">
                      • Category{" "}
                      <strong>{performanceMetrics.lowestCategory[0]}</strong>{" "}
                      needs attention for{" "}
                      <strong>
                        {performanceMetrics.lowestCategory[1].timeRange}
                      </strong>{" "}
                      with revenue of $
                      {performanceMetrics.lowestCategory[1].revenue.toLocaleString()}{" "}
                      (
                      {performanceMetrics.lowestCategory[1].percentageDiff.toFixed(
                        1,
                      )}
                      % below average)
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
