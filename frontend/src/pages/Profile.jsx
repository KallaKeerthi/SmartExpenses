import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from "@/services/api";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Hash, TrendingUp, List, BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const getUserShare = (exp, userId) => {
    if (!exp.participants || exp.participants.length === 0) {
        return exp.amount;
    }
    // If user is the payer → full amount
    if (exp.paidBy === userId) {
        return exp.amount;
    }
    // Otherwise → equal split
    return exp.amount / exp.participants.length;
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await expenseAPI.getExpenses();
        // Replace raw amounts with user share
        const processed = data.map((exp) => ({
            ...exp,
            userShare: getUserShare(exp, user._id),
        }));

        setExpenses(processed);

        // Top 5
        const sorted = [...processed].sort((a, b) => b.userShare - a.userShare).slice(0, 5);
        setTopExpenses(sorted);

        // Monthly grouping
        const monthMap = {};
        processed.forEach((exp) => {
          const month = new Date(exp.date).toLocaleString("default", { month: "short" });
          monthMap[month] = (monthMap[month] || 0) + exp.userShare;
        });
        setMonthlyData(
          Object.entries(monthMap).map(([name, value]) => ({ name, value }))
        );
      } catch (err) {
        console.error("Failed to load expenses", err);
      }
    };
    fetchExpenses();
  }, [user._id]);

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

  return (
    <div className="container mx-auto px-4 mt-8 space-y-8">
      <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

  {/* User Card */}
  <Card className="p-4 md:p-6 shadow-lg border-0 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl">
    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
      <Avatar className="h-20 w-20 ring-4 ring-white shadow-md">
        <AvatarFallback className="bg-white text-pink-600 font-bold text-2xl">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="text-center sm:text-left">
        <h2 className="text-2xl md:text-3xl font-bold">{user?.username}</h2>
        <p className="flex items-center justify-center sm:justify-start gap-2 mt-1"><Mail /> {user?.email}</p>
        <p className="flex items-center justify-center sm:justify-start gap-2 text-sm opacity-90 mt-1"><Hash /> ID: {user?._id}</p>
      </div>
    </div>
  </Card>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <Card className="shadow-md border-0 text-center p-4 md:p-6 rounded-xl">
      <CardHeader className="flex flex-col items-center">
        <User className="text-indigo-500 h-10 w-10 mb-2" />
        <CardTitle>Total Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl md:text-4xl font-bold text-indigo-600">{expenses.length}</p>
      </CardContent>
    </Card>

    <Card className="shadow-md border-0 text-center p-4 md:p-6 rounded-xl">
      <CardHeader className="flex flex-col items-center">
        <TrendingUp className="text-green-500 h-10 w-10 mb-2" />
        <CardTitle>Top Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {topExpenses[0] ? (
          <p className="text-lg md:text-xl font-semibold text-green-600">
            {topExpenses[0].description} – ₹{topExpenses[0].userShare.toFixed(2)}
          </p>
        ) : (
          <p>No data</p>
        )}
      </CardContent>
    </Card>

    <Card className="shadow-md border-0 text-center p-4 md:p-6 rounded-xl">
      <CardHeader className="flex flex-col items-center">
        <List className="text-pink-500 h-10 w-10 mb-2" />
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={expenses.map((e) => ({ name: e.category, value: e.userShare }))}
              outerRadius={60}
              dataKey="value"
            >
              {expenses.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Monthly Trend */}
  <Card className="shadow-md border-0 p-4 md:p-6 rounded-xl">
    <CardHeader className="flex items-center space-x-2">
      <BarChart3 className="text-purple-500" />
      <CardTitle>Monthly Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* Top 5 List */}
  <Card className="shadow-md border-0 p-4 md:p-6 rounded-xl">
    <CardHeader>
      <CardTitle>Top 5 Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      {topExpenses.length > 0 ? (
        <ul className="space-y-2">
          {topExpenses.map((exp, i) => (
            <li key={exp._id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="font-medium">{i + 1}. {exp.description}</span>
              <span className="text-indigo-600 font-bold">₹{exp.userShare.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses available</p>
      )}
    </CardContent>
  </Card>
</div>
  );
};
