'use client';

import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, send the form data to an API
    console.log({ name, email, message });
    
    // Simulate submission
    setSubmitted(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-primary/5 to-background py-12">
          <Container>
            <Link href={{ pathname: "/" }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight mb-3">Contact Support</h1>
              <p className="text-muted-foreground mb-10">
                We&apos;re here to help you with any questions or issues you may have.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we&apos;ll get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {submitted ? (
                        <div className="py-8 text-center">
                          <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                              <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                          <h3 className="text-lg font-medium">Message Received</h3>
                          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            Thank you for reaching out. We&apos;ve received your message and will respond shortly.
                          </p>
                          <Button 
                            className="mt-4"
                            onClick={() => {
                              setName('');
                              setEmail('');
                              setMessage('');
                              setSubmitted(false);
                            }}
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <FormField id="name" label="Full Name">
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              required
                            />
                          </FormField>
                          
                          <FormField id="email" label="Email Address">
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your.email@example.com"
                              required
                            />
                          </FormField>
                          
                          <FormField id="message" label="Message">
                            <Textarea
                              id="message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="How can we help you?"
                              className="min-h-[150px]"
                              required
                            />
                          </FormField>
                          
                          <Button type="submit" className="w-full">
                            Send Message
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:support@quikbroker.com" className="text-sm text-primary hover:underline">
                            support@quikbroker.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <a href="tel:+18005551234" className="text-sm text-primary hover:underline">
                            (800) 555-1234
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            Monday - Friday, 9am - 5pm ET
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>FAQs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium">How quickly will I get a response?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          We aim to respond to all inquiries within 24 hours during business days.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">What information should I include?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please include your account details and a detailed description of your issue.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}