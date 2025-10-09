import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Sparkles, Facebook, Instagram, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Contact = () => {
  const navigate = useNavigate();

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              Connect With Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Follow us on social media to stay updated with the latest creative content, 
              artist features, and community highlights.
            </p>
          </div>
        </div>
      </section>

      {/* Social Media & Contact Info */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Social Media Section */}
            <div className="lg:col-span-2">
              <Card className="card-hover glass border-0">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">Follow Us on Social Media</h2>
                  <p className="text-muted-foreground mb-8">
                    Join our community and stay connected with the latest updates, featured artists, and creative inspiration.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Facebook Button */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                          <Facebook className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Facebook</h3>
                          <p className="text-sm text-muted-foreground">Connect with our community</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSocialClick('https://www.facebook.com/share/14Ec9xhipQ2/')}
                        className="w-full btn-modern bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      >
                        Visit Our Facebook Page
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Instagram Button */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Instagram</h3>
                          <p className="text-sm text-muted-foreground">Visual inspiration daily</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSocialClick('https://www.instagram.com/beinspiredmagazine1?igsh=MWlrbnk5dDc2ZW5lYQ==')}
                        className="w-full btn-modern bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white"
                      >
                        Follow Us on Instagram
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Direct Contact CTA */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">Need Direct Contact?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For business inquiries, collaborations, or direct support, reach out to us via email or phone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = 'mailto:beinspiredmagazine1@gmail.com'}
                        className="flex-1"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email Us
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = 'tel:+27659461184'}
                        className="flex-1"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="card-hover glass border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-muted-foreground">beinspiredmagazine1@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-sm text-muted-foreground">+27 65 946 1184</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Address</h4>
                        <p className="text-sm text-muted-foreground">
                          Soweto<br />
                          Johannesburg, South Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover glass border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How do I upload my digital magazine?",
                answer: "After creating an account, go to your dashboard and click 'Upload Magazine'. You can upload PDF files and add cover images, descriptions, and categorize your work."
              },
              {
                question: "Is there a cost to use the platform?",
                answer: "Our basic features are free to use. You can upload, share, and view magazines at no cost. We may introduce premium features in the future."
              },
              {
                question: "What file formats are supported?",
                answer: "Currently, we support PDF files for magazines. We're working on adding support for other formats like EPUB and interactive content."
              },
              {
                question: "How can I connect with other artists?",
                answer: "You can browse artist profiles, follow your favorite creators, and engage with their work through our community features."
              }
            ].map((faq, index) => (
              <Card key={index} className="card-hover glass border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
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

export default Contact;