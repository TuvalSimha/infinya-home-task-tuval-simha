"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockSalesData } from "@/lib/mockData";

export default function SQLQuery() {
  const [activeQuery, setActiveQuery] = useState<number | null>(null);

  const queries = [
    {
      title: "Top 3 Products by Revenue for Each Category",
      query: `
        SELECT Category, ProductName, Revenue
        FROM (
          SELECT 
            Category, 
            ProductName, 
            SUM(Revenue) as Revenue,
            ROW_NUMBER() OVER (PARTITION BY Category ORDER BY SUM(Revenue) DESC) as rn
          FROM sales
          GROUP BY Category, ProductName
        ) ranked
        WHERE rn <= 3
        ORDER BY Category, Revenue DESC
      `,
      execute: () => {
        const result: Record<
          string,
          { ProductName: string; Revenue: number }[]
        > = {};
        mockSalesData.forEach((sale) => {
          if (!result[sale.Category]) result[sale.Category] = [];
          const existingProduct = result[sale.Category].find(
            (p) => p.ProductName === sale.ProductName,
          );
          if (existingProduct) {
            existingProduct.Revenue += sale.Revenue;
          } else {
            result[sale.Category].push({
              ProductName: sale.ProductName,
              Revenue: sale.Revenue,
            });
          }
        });
        Object.keys(result).forEach((category) => {
          result[category].sort((a, b) => b.Revenue - a.Revenue);
          result[category] = result[category].slice(0, 3);
        });
        return result;
      },
    },
    {
      title: "Region with Highest Revenue for Each Month",
      query: `
        SELECT Month, Region, Revenue
        FROM (
          SELECT 
            EXTRACT(MONTH FROM Date) as Month,
            Region,
            SUM(Revenue) as Revenue,
            ROW_NUMBER() OVER (PARTITION BY EXTRACT(MONTH FROM Date) ORDER BY SUM(Revenue) DESC) as rn
          FROM sales
          GROUP BY EXTRACT(MONTH FROM Date), Region
        ) ranked
        WHERE rn = 1
        ORDER BY Month
      `,
      execute: () => {
        const result: Record<string, { Region: string; Revenue: number }> = {};
        mockSalesData.forEach((sale) => {
          const month = new Date(sale.Date).toLocaleString("default", {
            month: "short",
          });
          if (!result[month] || sale.Revenue > result[month].Revenue) {
            result[month] = { Region: sale.Region, Revenue: sale.Revenue };
          } else if (result[month]) {
            result[month].Revenue += sale.Revenue;
          }
        });
        return result;
      },
    },
    {
      title: "Average Revenue per Sale for Each Category",
      query: `
        SELECT 
          Category,
          AVG(Revenue) as AvgRevenue
        FROM sales
        GROUP BY Category
        ORDER BY AvgRevenue DESC
      `,
      execute: () => {
        const result: Record<
          string,
          { TotalRevenue: number; SaleCount: number }
        > = {};
        mockSalesData.forEach((sale) => {
          if (!result[sale.Category])
            result[sale.Category] = { TotalRevenue: 0, SaleCount: 0 };
          result[sale.Category].TotalRevenue += sale.Revenue;
          result[sale.Category].SaleCount++;
        });
        return Object.entries(result).map(([Category, data]) => ({
          Category,
          AvgRevenue: data.TotalRevenue / data.SaleCount,
        }));
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">SQL Queries</h1>
      {queries.map((q, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>{q.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{q.query}</code>
            </pre>
            <Button onClick={() => setActiveQuery(index)} className="mt-4">
              Execute Query
            </Button>
            {activeQuery === index && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(Object.values(q.execute())[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(q.execute()).map(([key, value], i) => (
                    <TableRow key={i}>
                      {Object.values(value).map((v, j) => (
                        <TableCell key={j}>
                          {typeof v === "number" ? v.toFixed(2) : String(v)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
