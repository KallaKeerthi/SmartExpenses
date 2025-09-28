import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Layout } from '@/components/layout/Layout';
import { expenseAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ReceiptIndianRupee } from 'lucide-react';

export const AddExpense = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    participants: '',
  });

  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Health',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const participantsList = formData.participants
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const expenseData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        participants: [...participantsList, user._id],
      };

      await expenseAPI.addExpense(expenseData);
      
      toast({
        title: "Success!",
        description: "Expense added successfully",
      });
      
      navigate('/expenses');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/expenses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Expense</h1>
            <p className="text-muted-foreground">
              Record a new expense and split it with others
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-medium border-0">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
              <ReceiptIndianRupee className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Expense Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Dinner at Restaurant"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participants">Split Between Participants ID</Label>
                  <Input
                    id="participants"
                    placeholder="63a5iu8n6287, 8687hiu3hf7j (comma separated)"
                    value={formData.participants}
                    onChange={(e) => handleInputChange('participants', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to assign to the person who paid
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/expenses')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {isLoading ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>  
  );
};