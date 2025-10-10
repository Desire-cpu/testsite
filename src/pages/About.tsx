import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Users, Target, Heart, Lightbulb, Award, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative cursor-pointer" onClick={() => navigate('/')}>
                <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-8 w-8 sm:h-10 sm:w-10 animate-float" />
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-pulse" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
                Be Inspired
              </h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="btn-modern text-xs sm:text-sm px-2 sm:px-3">
                Home
              </Button>
              <Button onClick={() => navigate('/auth')} className="btn-modern bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-xs sm:text-sm px-2 sm:px-3">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              About Be Inspired Magazine
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Be Inspired Magazine is a platform dedicated to celebrating creativity, resilience, and vision. 
              Founded with the belief that every story has the power to spark change, we shine a light on 
              artists, innovators, entrepreneurs, and everyday dreamers who are shaping culture in meaningful ways.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12">
            <Card className="card-hover glass border-0">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To amplify the voices of creative individuals who are making a difference in their communities 
                  and beyond. We believe in the transformative power of storytelling to inspire, connect, and 
                  drive positive change across all walks of life.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover glass border-0">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To create a world where every creative voice is heard and celebrated, fostering a global 
                  community that values innovation, resilience, and the courage to dream big and make those dreams reality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who We Celebrate */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Who We Celebrate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We feature diverse voices and stories that inspire, challenge, and transform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: "Artists",
                description: "Visual artists, writers, musicians, and creators who push boundaries and express unique perspectives through their work.",
                gradient: "from-yellow-500 to-orange-600"
              },
              {
                icon: Award,
                title: "Innovators",
                description: "Tech pioneers, inventors, and forward-thinkers who are solving problems and creating the future we want to live in.",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                icon: Users,
                title: "Entrepreneurs",
                description: "Business leaders and startup founders who are building companies with purpose and making positive impact.",
                gradient: "from-green-500 to-teal-600"
              },
              {
                icon: Heart,
                title: "Dreamers",
                description: "Everyday people with extraordinary visions who are working to make their communities and the world a better place.",
                gradient: "from-pink-500 to-red-600"
              }
            ].map((category, index) => (
              <Card key={index} className="card-hover glass border-0">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the platform features that amplify creative voices and build meaningful connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Digital Storytelling",
                description: "Share your journey, showcase your work, and tell your story through beautifully crafted digital magazines that reach a global audience.",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                icon: Globe,
                title: "Cultural Impact",
                description: "Connect with a community that values meaningful change and cultural contribution. Be part of a movement that shapes tomorrow.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: Sparkles,
                title: "Inspiration Network",
                description: "Discover stories of resilience and vision that spark new ideas. Find your tribe and be inspired by others who dare to dream.",
                gradient: "from-pink-500 to-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="card-hover glass border-0">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto space-y-6 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              Ready to Share Your Story of Change?
            </h2>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed px-2 sm:px-0">
              Join a community of creators, innovators, and dreamers who believe in the power of stories to inspire transformation.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="btn-modern bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base h-auto font-semibold"
            >
              Be Part of the Movement
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-base sm:text-lg font-semibold text-primary">Be Inspired</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Be Inspired. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;