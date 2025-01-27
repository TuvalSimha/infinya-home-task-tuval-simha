# Sales Analytics Dashboard

A modern, responsive sales analytics dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components. This dashboard provides comprehensive insights into sales data with interactive visualizations and data analysis features.

## Features

### Dashboard

- **Interactive Filters**
  - Year selection
  - Month selection (dynamic based on year)
  - Category selection
- **Visualizations**
  - Revenue by Region (Pie Chart)
  - Top 5 Products by Revenue (Bar Chart with category context)
  - Performance Insights with time-based analysis
  - Region/Category performance comparisons

### SQL Analysis

- Pre-built SQL queries for common analysis tasks
- Query explanations and insights
- Example queries include:
  - Top products by revenue per category
  - Highest revenue regions by month
  - Average revenue analysis

### Data Model

```typescript
interface Sales {
  SalesID: number;
  Date: string;
  ProductName: string;
  Category: "Books" | "Clothing" | "Electronics" | "Home" | "Toys";
  Region: "North" | "South" | "East" | "West";
  Quantity: number;
  Revenue: number;
}
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useMemo)

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd sales-analytics-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Install required shadcn/ui components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add sheet
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx         # Dashboard page
│   ├── sql/
│   │   └── page.tsx     # SQL queries page
│   └── etl/
│       └── page.tsx     # ETL page
├── components/
│   ├── ui/             # shadcn components
│   └── Navigation.tsx  # Navigation component
├── lib/
│   └── mockData.ts    # Sample data
└── types/
    └── index.ts       # Type definitions
```

## Features in Detail

### Dashboard Filters

- **Year Filter**: Select specific year or view all years
- **Month Filter**:
  - Shows all months for specific year
  - Shows month-year combinations when "All Years" is selected
- **Category Filter**: Filter by product category

### Performance Insights

- Region and category performance analysis
- Time-based comparisons
- Revenue trends
- Improvement recommendations

### Responsive Design

- Mobile-friendly navigation
- Responsive charts and grids
- Optimized layouts for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Performance Optimization

The dashboard uses several optimization techniques:

- Memoized calculations using `useMemo`
- Efficient data filtering
- Responsive image loading
- Type-safe implementations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Shadcn for the wonderful UI components
- Recharts for the charting library
- The Next.js team for the amazing framework
