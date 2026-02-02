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
  const { settings } = useWebsiteSettings();
  const websiteName = settings?.websiteName || "Premium Car Rentals Australia";

  const featuredCars = cars?.slice(0, 3) || [];
  const popularTrips = [
    {
      title: "Alpine Escape",
      route: "Tokyo → Hakuba → Karuizawa → Tokyo",
      distance: "560 km • 4 days",
      description:
        "Switch between powder runs and fireside fondue. Our concierge stocks the roof box and heated blankets.",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Neon Coast Cruise",
      route: "Osaka → Awaji Island → Kobe",
      distance: "210 km • 2 days",
      description:
        "Sunrise over Seto Inland Sea, Michelin izakayas at night. Includes toll pass + curated playlist.",
      image:
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Volcanic Skyline",
      route: "Kyoto → Mt. Aso → Beppu → Fukuoka",
      distance: "720 km • 5 days",
      description:
        "Private onsen bookings, drone-ready scenic pullouts, and a backup EV charger in the trunk.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <>
      <SEO
        title="Premium Car Rentals Australia"
        description="Australia's premier car rental service offering luxury vehicles, premium sedans, SUVs, and sports cars. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates."
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
              {settings?.heroTitle || "Premium Car Rentals Australia"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              {settings?.heroSubtitle || "Experience luxury and performance with Australia's finest collection of premium vehicles. Available across Sydney, Melbourne, Brisbane, Perth, and Adelaide."}
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
              <h2 className="text-4xl font-bold mb-4">Featured Vehicles</h2>
              <p className="text-lg text-muted-foreground">
                Discover our most popular luxury and performance cars
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

        <section className="py-16 md:py-24 px-6 bg-muted/40">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Popular Trips</h2>
              <p className="text-muted-foreground">
                Curated itineraries complete with charging stops, scenic cafes, and concierge support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTrips.map((trip) => (
                <Card key={trip.title} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={getThumbnailUrl(trip.image, 900)}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{trip.title}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{trip.route}</p>
                    <p className="text-sm text-muted-foreground">{trip.distance}</p>
                    <p className="text-base">{trip.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Renting a car has never been easier
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CarIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Choose Your Car</h3>
                <p className="text-muted-foreground">
                  Browse our extensive fleet and select the perfect vehicle for your needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Book Online</h3>
                <p className="text-muted-foreground">
                  Complete your reservation quickly and securely through our platform
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Hit the Road</h3>
                <p className="text-muted-foreground">
                  Pick up your vehicle and enjoy your journey with confidence
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Premium Vehicles</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">5</div>
                <div className="text-muted-foreground">Locations</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-lg text-muted-foreground">
                Hear from those who have experienced our premium service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <h4 className="font-semibold">James Davidson</h4>
                    <p className="text-sm text-muted-foreground">Business Executive</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Outstanding service! The Tesla Model 3 was in perfect condition, and the booking process was seamless. {websiteName} made my business trip incredibly convenient."
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                    SM
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Martinez</h4>
                    <p className="text-sm text-muted-foreground">Family Traveler</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "We rented the BMW X5 for our family vacation and it was perfect! Spacious, comfortable, and the customer support was fantastic. Highly recommend!"
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Book your premium vehicle today and experience the road like never before
            </p>
            <Link href="/cars">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-white/90 border-0"
                data-testid="button-book-now"
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}