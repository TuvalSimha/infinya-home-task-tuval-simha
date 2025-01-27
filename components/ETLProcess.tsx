import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ETLProcess() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ETL Process</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Extract</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To import the CSV file into a database, you can use the following
            SQL command:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`
COPY sales(SalesID, Date, ProductName, Category, Region, Quantity, Revenue)
FROM '/path/to/SalesData.csv'
DELIMITER ','
CSV HEADER;
            `}</code>
          </pre>
          <p className="mt-2">
            This command assumes you've already created a table named 'sales'
            with the appropriate columns.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transform</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To create a new column called "Profit", you can use the following
            SQL command:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`
ALTER TABLE sales ADD COLUMN Profit DECIMAL(10, 2);
UPDATE sales SET Profit = Revenue - (Quantity * 10);
            `}</code>
          </pre>
          <p className="mt-2">
            This assumes a cost of 10 per unit as specified in the task.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Load</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To load the processed data into another system, you can use various
            methods depending on the target system. Here are a few examples:
          </p>
          <ol className="list-decimal pl-5 mt-2">
            <li>
              Export to CSV:
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mt-2">
                <code>{`
COPY sales TO '/path/to/processed_sales.csv' DELIMITER ',' CSV HEADER;
                `}</code>
              </pre>
            </li>
            <li className="mt-4">
              Insert into another database:
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mt-2">
                <code>{`
INSERT INTO target_database.sales
SELECT * FROM source_database.sales;
                `}</code>
              </pre>
            </li>
            <li className="mt-4">
              Use a data integration tool like Apache NiFi or Talend for more
              complex ETL processes.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
