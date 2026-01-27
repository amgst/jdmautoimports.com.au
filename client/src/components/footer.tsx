import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Send
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWebsiteSettings } from "@/hooks/use-website-settings";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 8.761-0.375-0.536L3.483 3.41H5.98l7.533 10.771 0.374 0.536 7.151 10.218h-2.497z" />
  </svg>
);

export function Footer() {
  const { isLoading, ...settings } = useWebsiteSettings();
  const [logoError, setLogoError] = useState(false);

  const logoUrl = settings?.logo;

  // Reset logo error when logo URL changes
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);

  const websiteName = settings?.websiteName || "Tokyo Drive";
  const companyName = settings?.companyName || "Tokyo Drive";
  const description = settings?.description || "JDM Auto Imports - Premium car rental service with the finest Japanese imports and luxury vehicles.";
  const email = settings?.email || "info@tokyodrive.com";
  const phone = settings?.phone || "+81 3-1234-5678";
  const address = settings?.address || "123 Premium Avenue, Tokyo, Japan";
  const facebookUrl = settings?.facebookUrl;
  const xUrl = settings?.xUrl;
  const instagramUrl = settings?.instagramUrl;
  const linkedinUrl = settings?.linkedinUrl;

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={websiteName}
                  className="h-5 sm:h-6 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Car className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              )}
              <span className="text-lg sm:text-xl font-bold">{websiteName}</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
            <div className="flex gap-3 sm:gap-4">
              {facebookUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {xUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={xUrl} target="_blank" rel="noopener noreferrer">
                    <XIcon className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {instagramUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {linkedinUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground break-words">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <a href={`tel:${phone}`} className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors break-all">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors break-all">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold">Newsletter</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}