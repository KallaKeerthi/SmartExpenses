import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { expenseAPI } from '@/services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ReceiptIndianRupee,
  Calendar,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense =>
      (expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredExpenses(filtered);
  }, [expenses, searchQuery]);

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

  const handleDeleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      setExpenses(expenses.filter(expense => expense._id !== id));
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    } finally {
      setDeleteExpenseId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getUserShare = (expense) => {
    if (!expense || !user) return 0;
    const participants = expense.participants || [];
    const isParticipant = participants.map(String).includes(String(user._id));
      if (participants.length === 0) return expense.amount || 0;
      return isParticipant ? (expense.amount || 0) / participants.length : 0;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-800',
      Transport: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Health: 'bg-green-100 text-green-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">
              Manage and track all your expenses
            </p>
          </div>
          <Button 
            onClick={() => navigate('/expenses/add')}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-soft border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-muted rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-32"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <Card key={expense._id} className="shadow-soft border-0 hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <ReceiptIndianRupee className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{expense.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(expense.category)}>
                            {expense.category}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-3 h-3 mr-1" />
                            {expense.participants?.length || 0} people
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">

                        <div className="flex flex-col items-end">
                          {expense.participants?.length > 1 && (
                            <p className="text-sm text-green-500 font-bold">
                              Your Share: {formatCurrency(getUserShare(expense))}
                            </p>
                          )}
                          <p className="text-lg font-bold text-foreground">
                            Total: {formatCurrency(expense.amount)}
                          </p>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Paid by {expense.paidBy.username || 'Unknown' }
                        </div>

                      </div>
                      <div className="flex space-x-2">
                        {/* Show Edit button only if logged-in user is the owner */}
                        {expense.paidBy._id === user._id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/expenses/edit/${expense._id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteExpenseId(expense._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-soft border-0">
              <CardContent className="p-12 text-center">
                <ReceiptIndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Start by adding your first expense"}
                </p>
                <Button 
                  onClick={() => navigate('/expenses/add')}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteExpenseId !== null} onOpenChange={() => setDeleteExpenseId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the expense.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteExpenseId && handleDeleteExpense(deleteExpenseId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};