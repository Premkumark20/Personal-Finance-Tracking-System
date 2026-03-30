# Personal Finance Tracking System

A modern, responsive web application built with React, TypeScript, and Tailwind CSS to help users manage their personal finances efficiently.

## 🚀 Features

- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Budget Tracking**: Set and monitor monthly budgets across different categories
- **Financial Analytics**: Visualize spending patterns with interactive charts
- **Dashboard Overview**: Get a comprehensive view of your financial health
- **Data Export**: Export data to Excel format with multiple sheets
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🚀 Deployment

This project is deployed on Netlify and automatically updates when changes are pushed to the main branch.

### Build Commands

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`
- **Test**: `npm run test`

## 📊 Export Features

The application provides comprehensive Excel export functionality with multiple data sheets:

### Export Options

- **Dashboard Export**: Complete financial overview with multiple sheets:
  - **Dashboard Sheet**: Monthly income/expense summary with savings rates
  - **Transactions Sheet**: Complete transaction history with full details
  - **Summary Sheet**: Monthly financial performance analysis
  - **Budgets Sheet**: Category-wise budget analysis with spending tracking
  - **Calendar Sheet**: Monthly transaction activity and patterns

- **Page-Specific Exports**: Each page can export its relevant data:
  - **Transactions Page**: Filtered transaction data
  - **Budgets Page**: Budget vs actual spending analysis
  - **Summary Page**: Monthly/annual financial summaries
  - **Dashboard**: Complete multi-sheet export

### Export Features

- **Multiple Sheets**: All data organized into separate Excel sheets
- **Rich Data**: Includes calculated fields like usage percentages and savings rates
- **Currency Formatting**: Proper ₹ symbol formatting with +/- signs
- **Professional Format**: Clean Excel files with proper headers
- **Date-Based Filenames**: Automatic naming with current date
- **Universal Access**: Export button available in header on all pages

### Supported Export Formats

- **Excel (.xlsx)**: Complete data with multiple sheets
- **JSON (.json)**: Database backup and import format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Live Demo**: [https://financetrackerbuild.netlify.app/](https://financetrackerbuild.netlify.app/)
"# Personal-Finance-Tracking-System" 
