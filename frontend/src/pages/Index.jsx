import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { 
  ReceiptIndianRupee, 
  PieChart, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ReceiptIndianRupee className="w-8 h-8 text-primary" />,
      title: "Smart Expense Tracking",
      description: "Easily track and categorize all your expenses with intelligent suggestions"
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Bill Splitting",
      description: "Split expenses with friends and family effortlessly"
    },
    {
      icon: <PieChart className="w-8 h-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Get intelligent insights about your spending patterns and habits"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
      title: "Real-time Analytics",
      description: "Beautiful charts and reports to visualize your financial data"
    }
  ];

  const benefits = [
    "Track expenses across multiple categories",
    "Split bills with friends and groups",
    "AI-powered spending insights",
    "Beautiful charts and analytics",
    "Secure and private data handling",
    "Mobile-responsive design"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-8">
              <ReceiptIndianRupee className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Smart Expenses
              </span>
              <br />
              <span className="text-foreground">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track, split, and analyze your expenses with AI-powered insights. 
              Take control of your finances with intelligent expense management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/register')}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make expense tracking and management effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft border-0 hover:shadow-medium transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why choose Smart Expenses?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our platform combines powerful expense tracking with AI intelligence 
                to give you unprecedented insights into your spending habits.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-strong border-0 bg-gradient-to-br from-card to-muted/20">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">Secure & Private</h3>
                          <p className="text-sm text-muted-foreground">Your data is protected</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-success rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-8 h-8 text-secondary" />
                        <div>
                          <h3 className="font-semibold">Lightning Fast</h3>
                          <p className="text-sm text-muted-foreground">Quick expense entry</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-secondary rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <PieChart className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">Smart Analytics</h3>
                          <p className="text-sm text-muted-foreground">AI-powered insights</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to take control of your expenses?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with our AI-powered platform.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-lg px-8 py-6"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ReceiptIndianRupee className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Smart Expenses
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Smart Expenses. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;