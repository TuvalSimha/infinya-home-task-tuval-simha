"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SqlPage = () => {
  const queries = [
    {
      question:
        "Write a query to find the top three products by revenue for each category.",
      query: `WITH RankedProducts AS (
  SELECT 
    Category,
    ProductName,
    SUM(Revenue) as TotalRevenue,
    ROW_NUMBER() OVER (PARTITION BY Category ORDER BY SUM(Revenue) DESC) as Rank
  FROM Sales
  GROUP BY Category, ProductName
)
SELECT 
  Category,
  ProductName,
  TotalRevenue
FROM RankedProducts
WHERE Rank <= 3
ORDER BY Category, TotalRevenue DESC;`,
      explanation:
        "This query uses a window function (ROW_NUMBER) to rank products within each category based on revenue. We then filter to show only the top 3 products per category.",
    },
    {
      question: "Find the region with the highest revenue for each month.",
      query: `WITH MonthlyRegionRevenue AS (
  SELECT 
    DATE_TRUNC('month', Date) as Month,
    Region,
    SUM(Revenue) as TotalRevenue,
    RANK() OVER (PARTITION BY DATE_TRUNC('month', Date) 
                 ORDER BY SUM(Revenue) DESC) as Rank
  FROM Sales
  GROUP BY DATE_TRUNC('month', Date), Region
)
SELECT 
  Month,
  Region,
  TotalRevenue
FROM MonthlyRegionRevenue
WHERE Rank = 1
ORDER BY Month;`,
      explanation:
        "This query first calculates total revenue by month and region, then uses RANK to identify the top performing region for each month.",
    },
    {
      question:
        "Write a query to calculate the average revenue per sale for each category.",
      query: `SELECT 
  Category,
  COUNT(*) as TotalSales,
  SUM(Revenue) as TotalRevenue,
  AVG(Revenue) as AverageRevenuePerSale,
  MIN(Revenue) as MinRevenue,
  MAX(Revenue) as MaxRevenue
FROM Sales
GROUP BY Category
ORDER BY AverageRevenuePerSale DESC;`,
      explanation:
        "This query provides a comprehensive view of sales metrics per category, including the average revenue per sale along with other useful statistics.",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SQL Queries</h1>

      <div className="space-y-6">
        {queries.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Query:</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{item.query}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
                  <p className="text-muted-foreground">{item.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SqlPage;
