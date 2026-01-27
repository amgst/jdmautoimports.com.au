import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  Shield,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useWebsiteSettings } from "@/hooks/use-website-settings";

export default function About() {
  const { isLoading, ...settings } = useWebsiteSettings();
  const websiteName = settings?.websiteName || "JDM Auto Imports";
  const companyName = settings?.companyName || websiteName;
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All our vehicles undergo rigorous safety inspections and maintenance checks to ensure your peace of mind.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "We maintain only the finest vehicles in our fleet, ensuring luxury and performance in every rental.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We provide exceptional service and support throughout your journey.",
    },
    {
      icon: Car,
      title: "Wide Selection",
      description: "From luxury sedans to powerful SUVs, we offer a diverse range of vehicles to suit every need.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Happy Customers" },
    { number: "50+", label: "Premium Vehicles" },
    { number: "5", label: "Service Locations" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About {companyName}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are a premium car rental service dedicated to providing exceptional vehicles and
              outstanding customer experiences. Since our founding, we've been committed to making
              luxury and performance accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                At {companyName}, our mission is to provide premium car rental services that exceed
                expectations. We believe that every journey should be comfortable, safe, and memorable.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Whether you're traveling for business or pleasure, we offer a curated selection of
                luxury vehicles maintained to the highest standards, backed by exceptional customer service.
              </p>
              <Link href="/cars">
                <Button size="lg" className="px-8">
                  Explore Our Fleet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Card className="p-8 bg-muted/40">
              <h3 className="text-2xl font-semibold mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  "Premium vehicle selection",
                  "Competitive pricing",
                  "24/7 customer support",
                  "Flexible rental terms",
                  "Comprehensive insurance options",
                  "Easy online booking",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-6 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? We'd love to hear from you. Reach out to our team for any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {settings?.phone && (
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{settings.phone}</span>
              </div>
            )}
            {settings?.email && (
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{settings.email}</span>
              </div>
            )}
            {settings?.address && (
              <div className="flex items-center justify-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{settings.address}</span>
              </div>
            )}
          </div>
          <Link href="/contact">
            <Button size="lg" className="px-8">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

