import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Car } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@assets/generated_images/Hero_banner_luxury_car_0ff28a2c.png";
import { getAllCarsFirebase } from "@/lib/carsFirebase";
import { getOptimizedImageUrl, getThumbnailUrl } from "@/lib/imageUtils";
import { SEO } from "@/components/seo";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import {
  Users,
  Car as CarIcon,
  MapPin,
  Shield,
  ArrowRight,
  Fuel,
  Settings,
  Users as SeatsIcon,
  Search,
  Star,
} from "lucide-react";

export default function Home() {
  const [heroCategory, setHeroCategory] = useState<string>("all");
  const [heroTransmission, setHeroTransmission] = useState<string>("all");
  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: getAllCarsFirebase,
  });
  const { isLoading: isSettingsLoading, ...settings } = useWebsiteSettings();
  const websiteName = settings?.websiteName || "JDM Auto Imports";

  const featuredCars = cars?.slice(0, 3) || [];


  return (
    <>
      <SEO
        title="JDM Auto Imports"
        description="Australia's premier car rental service offering JDM and premium vehicles. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates."
      />
      <div>
        <section className="relative h-screen min-h-[600px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getOptimizedImageUrl(settings?.heroImage || heroImage, { width: 2400 })})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {settings?.heroTitle || "JDM Auto Imports"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              {settings?.heroSubtitle || "Experience luxury and performance with Australia's finest collection of JDM and premium vehicles."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={settings?.heroButtonLink || "/cars"}>
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground border border-primary-border"
                  data-testid="button-browse-cars"
                >
                  {settings?.heroButtonText || "Browse Our Fleet"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={settings?.heroLearnMoreLink || "#features"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold text-white border-2 border-white/30 bg-white/10 backdrop-blur-sm"
                  data-testid="button-learn-more"
                >
                  {settings?.heroLearnMoreText || "Learn More"}
                </Button>
              </Link>
            </div>

            <Card className="p-6 bg-background/95 backdrop-blur-sm border-background/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={heroCategory} onValueChange={setHeroCategory}>
                  <SelectTrigger data-testid="select-hero-category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={heroTransmission} onValueChange={setHeroTransmission}>
                  <SelectTrigger data-testid="select-hero-transmission">
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>

                <Link href={(() => {
                  const params = new URLSearchParams();
                  if (heroCategory !== "all") params.set("category", heroCategory);
                  if (heroTransmission !== "all") params.set("transmission", heroTransmission);
                  return `/cars${params.toString() ? `?${params.toString()}` : ""}`;
                })()}>
                  <Button className="w-full" size="lg" data-testid="button-hero-search">
                    <Search className="mr-2 h-5 w-5" />
                    Search Vehicles
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{settings?.featuredTitle || "Featured Vehicles"}</h2>
              <p className="text-lg text-muted-foreground">
                {settings?.featuredSubtitle || "Discover our most popular luxury and performance cars"}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                  <Link key={car.id} href={`/cars/${car.slug}`}>
                    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-car-${car.id}`}>
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getThumbnailUrl(car.image, 720)}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1" data-testid={`text-car-name-${car.id}`}>
                              {car.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {car.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <SeatsIcon className="h-4 w-4" />
                            <span>{car.seats}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-4 w-4" />
                            <span>{car.fuelType}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold" data-testid={`text-price-${car.id}`}>
                              ${car.pricePerDay}
                            </span>
                            <span className="text-muted-foreground">/day</span>
                          </div>
                          <Badge variant={car.available ? "default" : "secondary"}>
                            {car.available ? "Available" : "Booked"}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/cars">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-view-all-cars">
                  View All Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>



        <section className="py-16 md:py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{settings?.howItWorksTitle || "How It Works"}</h2>
              <p className="text-lg text-muted-foreground">
                {settings?.howItWorksSubtitle || "Renting a car has never been easier"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CarIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{settings?.howItWorksStep1Title || "Choose Your Car"}</h3>
                <p className="text-muted-foreground">
                  {settings?.howItWorksStep1Description || "Browse our extensive fleet and select the perfect vehicle for your needs"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{settings?.howItWorksStep2Title || "Book Online"}</h3>
                <p className="text-muted-foreground">
                  {settings?.howItWorksStep2Description || "Complete your reservation quickly and securely through our platform"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{settings?.howItWorksStep3Title || "Hit the Road"}</h3>
                <p className="text-muted-foreground">
                  {settings?.howItWorksStep3Description || "Pick up your vehicle and enjoy your journey with confidence"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{settings?.stats1Value || "1000+"}</div>
                <div className="text-muted-foreground">{settings?.stats1Label || "Happy Customers"}</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{settings?.stats2Value || "50+"}</div>
                <div className="text-muted-foreground">{settings?.stats2Label || "Premium Vehicles"}</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{settings?.stats3Value || "5"}</div>
                <div className="text-muted-foreground">{settings?.stats3Label || "Locations"}</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{settings?.stats4Value || "24/7"}</div>
                <div className="text-muted-foreground">{settings?.stats4Label || "Support"}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{settings?.testimonialsTitle || "What Our Customers Say"}</h2>
              <p className="text-lg text-muted-foreground">
                {settings?.testimonialsSubtitle || "Hear from those who have experienced our premium service"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                    {settings?.testimonial1Name?.charAt(0) || "J"}
                  </div>
                  <div>
                    <h4 className="font-semibold">{settings?.testimonial1Name || "James Davidson"}</h4>
                    <p className="text-sm text-muted-foreground">{settings?.testimonial1Role || "Business Executive"}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{settings?.testimonial1Content || `Outstanding service! The Tesla Model 3 was in perfect condition, and the booking process was seamless. ${websiteName} made my business trip incredibly convenient.`}"
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                    {settings?.testimonial2Name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <h4 className="font-semibold">{settings?.testimonial2Name || "Sarah Martinez"}</h4>
                    <p className="text-sm text-muted-foreground">{settings?.testimonial2Role || "Family Traveler"}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{settings?.testimonial2Content || "We rented the BMW X5 for our family vacation and it was perfect! Spacious, comfortable, and the customer support was fantastic. Highly recommend!"}"
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section
          className="relative py-24 px-6"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/60" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {settings?.ctaTitle || "Ready to Start Your Journey?"}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {settings?.ctaSubtitle || "Book your premium vehicle today and experience the road like never before"}
            </p>
            <Link href={settings?.ctaButtonLink || "/cars"}>
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 border-0"
                data-testid="button-book-now"
              >
                {settings?.ctaButtonText || "Book Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}