import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expenseAPI } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

export const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const expenses = await expenseAPI.getExpenses();
        const expense = expenses.find((e) => e._id === id);
        if (expense) {
          setFormData({
            title: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date?.slice(0, 10), // format YYYY-MM-DD
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch expense",
          variant: "destructive",
        });
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      description: formData.title,  // map title to description
      amount: formData.amount,
      category: formData.category,
      date: formData.date,
    };

    await expenseAPI.updateExpense(id, payload);

    toast({ title: "Success", description: "Expense updated" });
    navigate("/expenses");
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update expense",
      variant: "destructive",
    });
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
        <h1 className="text-3xl font-bold">Update Expense</h1>
          <p className="text-muted-foreground">
            Change the existing expense by updating expense.
          </p>
      </div>
    </div>

    {/* Form */}
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            name="amount"
            placeholder="Amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
          <Input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          <Button type="submit" className="w-full">
            Update Expense
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  </div>
  );
};
