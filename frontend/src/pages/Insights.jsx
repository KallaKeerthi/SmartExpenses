import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { expenseAPI } from '@/services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Lightbulb,
  IndianRupee,
  Calendar,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Insights = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserShare = (expense, currentUser) => {
    if (!expense || !currentUser) return 0;

    const participants = expense.participants || [];

    // Participants are IDs, so compare with currentUser._id
    const isParticipant = participants.includes(currentUser._id);

    if (participants.length === 0) {
      return expense.amount || 0; // fallback: whole amount
    }

    return isParticipant ? (expense.amount || 0) / participants.length : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseData = await expenseAPI.getExpenses();
        setExpenses(expenseData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch insights data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts
  const categoryData = React.useMemo(() => {
    const categoryTotals = {};
    const categoryColors = {
      Food: '#FF6B6B',
      Transport: '#4ECDC4',
      Entertainment: '#45B7D1',
      Shopping: '#96CEB4',
      Bills: '#FFEAA7',
      Health: '#DDA0DD',
      Other: '#98D8C8',
    };

    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + getUserShare(expense, user);
    });

    return Object.entries(categoryTotals).map(([username, value]) => ({
      username,
      value,
      color: categoryColors[username] || categoryColors.Other,
    }));
  }, [expenses]);

  const monthlyData = React.useMemo(() => {
    const monthlyTotals = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + getUserShare(expense, user);
    });

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount,
      }));
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + getUserShare(expense, user), 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const highestCategory = categoryData.reduce((max, cat) => cat.value > max.value ? cat : max, { username: '', value: 0 });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const aiInsights = [
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      title: "Top Spending Category",
      content: `You spend most on ${highestCategory.username} (${formatCurrency(highestCategory.value)}). Consider setting a monthly budget for this category.`
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-secondary" />,
      title: "Spending Trend",
      content: monthlyData.length >= 2 && monthlyData[monthlyData.length - 1].amount > monthlyData[monthlyData.length - 2].amount 
        ? "Your spending increased this month. Try to identify areas where you can cut back."
        : "Good news! Your spending is stable or decreasing compared to last month."
    },
    {
      icon: <IndianRupee className="w-5 h-5 text-warning" />,
      title: "Average Expense",
      content: `Your average expense is ${formatCurrency(averageExpense)}. Consider tracking smaller expenses to get a complete picture.`
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Insights & Analytics</h1>
          <p className="text-muted-foreground">
            Smart analysis of your spending patterns and habits
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {expenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Expense
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageExpense)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Category
              </CardTitle>
              <PieChartIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highestCategory.username}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(highestCategory.value)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-primary" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ username, percent }) => `${username} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Monthly Spending Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/10">
                  <div className="flex items-center mb-3">
                    {insight.icon}
                    <h3 className="font-semibold ml-2">{insight.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Table */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium">{category.username}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(category.value)}</div>
                      <div className="text-sm text-muted-foreground">
                        {((category.value / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};