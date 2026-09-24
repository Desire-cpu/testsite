import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const LAST_UPDATED = "September 2026";
const CONTACT_EMAIL = "beinspiredmagazine1@gmail.com";

const sections: { title: string; content: React.ReactNode }[] = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p className="mb-3">
          We collect information you provide directly to us, and information collected
          automatically when you use the Be Inspired website and app:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account information (name, artist name, email address) when you sign up</li>
          <li>Content you upload or create (poems, songs, magazine submissions, blog posts)</li>
          <li>Device information (model, OS version, unique device identifiers)</li>
          <li>Usage data (screens visited, content viewed, features used)</li>
          <li>Crash reports and performance data</li>
          <li>Advertising identifiers, used for personalised ads</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Provide, maintain and improve our services</li>
        <li>Create and manage your account</li>
        <li>Personalise your content experience</li>
        <li>Show relevant advertisements</li>
        <li>Monitor and analyse usage patterns</li>
        <li>Detect and prevent fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>
    ),
  },
  {
    title: "3. Advertising",
    content: (
      <p>
        Be Inspired uses Google AdMob to display advertisements in our mobile app. AdMob
        may collect and use data, including advertising identifiers, to show you
        personalised ads based on your interests. You can opt out of personalised
        advertising in your device settings, and iOS users are asked for App Tracking
        Transparency permission before any tracking occurs. For more information, see
        Google's Privacy Policy at{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          policies.google.com/privacy
        </a>
        .
      </p>
    ),
  },
  {
    title: "4. Firebase & Data Storage",
    content: (
      <p>
        We use Google Firebase (Authentication, Firestore and Storage) to manage
        accounts and to store and deliver app content such as magazines, songs, poems
        and blogs. Firebase may collect anonymous usage analytics on our behalf. Your
        favourites and playlists are stored locally on your device and are not uploaded
        to our servers.
      </p>
    ),
  },
  {
    title: "5. Third-Party Services",
    content: (
      <>
        <p className="mb-3">
          Our website and app may contain links to third-party websites or services. We
          are not responsible for the privacy practices of these third parties, and we
          encourage you to read their privacy policies. Third-party services we use
          include:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Google Firebase (authentication, database & storage)</li>
          <li>Google AdMob (advertising)</li>
          <li>Google Analytics (usage analytics)</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Children's Privacy",
    content: (
      <p>
        Be Inspired is not directed to children under the age of 13. We do not
        knowingly collect personal information from children under 13. If you believe
        we have collected information from a child under 13, please contact us
        immediately so we can remove it.
      </p>
    ),
  },
  {
    title: "7. Your Choices & Rights",
    content: (
      <p>
        You can review and update your account information at any time from within the
        app. You may request access to, correction of, or deletion of your personal
        information by contacting us at the email address below. We will respond to
        verified requests in line with applicable data protection law.
      </p>
    ),
  },
  {
    title: "8. Data Security",
    content: (
      <p>
        We take reasonable measures to protect your information from unauthorised
        access, alteration, disclosure or destruction. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </p>
    ),
  },
  {
    title: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any
        changes by updating the "Last updated" date at the top of this policy.
        Continued use of the website or app after changes constitutes acceptance of the
        updated policy.
      </p>
    ),
  },
  {
    title: "10. Contact Us",
    content: (
      <p>
        If you have any questions about this Privacy Policy or how your data is
        handled, please contact us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-primary underline underline-offset-2"
        >
          {CONTACT_EMAIL}
        </a>
        . We aim to respond to inquiries within 5 business days.
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-16 sm:pb-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {sections.map((s) => (
              <Card key={s.title} className="card-hover glass border-0">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-base sm:text-lg font-bold text-primary mb-3">
                    {s.title}
                  </h2>
                  <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {s.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;