import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { expenseAPI } from '@/services/api';
import { Layout } from '@/components/layout/Layout';
import { 
  IndianRupee, 
  TrendingUp, 
  ReceiptIndianRupee, 
  Plus, 
  ArrowUpRight,
  Clock,
  PieChart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    const fetchExpenses = async () => {
      try {
        const data = await expenseAPI.getExpenses();
        setExpenses(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch expenses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + getUserShare(expense, user), 0);
  const recentExpenses = expenses.slice(0, 3);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, expense) => sum + getUserShare(expense, user),
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground shadow-strong">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-primary-foreground/80 mb-6">
            Here's an overview of your expense management
          </p>
          <Button 
            onClick={() => navigate('/expenses/add')}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Expense
          </Button>
        </div>

        {/* Stats Cards */}
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
                All time expenses
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(thisMonthTotal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {thisMonthExpenses.length} expenses this month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Records
              </CardTitle>
              <ReceiptIndianRupee className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Expense records tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/expenses/add')}
                className="w-full justify-start bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Expense
              </Button>
              <Button 
                onClick={() => navigate('/expenses')}
                variant="outline"
                className="w-full justify-start"
              >
                <ReceiptIndianRupee className="w-4 h-4 mr-2" />
                View All Expenses
              </Button>
              <Button 
                onClick={() => navigate('/insights')}
                variant="outline"
                className="w-full justify-start"
              >
                <PieChart className="w-4 h-4 mr-2" />
                View Insights
              </Button>
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <ReceiptIndianRupee className="w-5 h-5 mr-2 text-primary" />
                Recent Expenses
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/expenses')}
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentExpenses.length > 0 ? (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <ReceiptIndianRupee className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.title}</p>
                          <p className="text-sm text-muted-foreground">{expense.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(getUserShare(expense, user))}</p>
                        {expense.participants?.length > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Total: {formatCurrency(expense.amount)}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ReceiptIndianRupee className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No expenses yet</p>
                  <Button 
                    onClick={() => navigate('/expenses/add')}
                    className="mt-3"
                    size="sm"
                  >
                    Add your first expense
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};