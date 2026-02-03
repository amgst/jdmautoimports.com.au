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
  const websiteName = settings?.websiteName || "Tokyo Drive Australia";

  const featuredCars = cars?.slice(0, 3) || [];

  return (
    <>
      <SEO
        title="Direct JDM Imports to Australia - Tokyo Drive"
        description="Tokyo Drive is Australia's premier JDM import specialist. We source, ship, and comply high-quality Japanese vehicles directly for you. Professional concierge and compliance services."
      />
      <div className="text-left">
        <section className="relative h-screen min-h-[600px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getOptimizedImageUrl(settings?.heroImage || heroImage, { width: 2400 })})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase">
              {settings?.heroTitle || "JDM Imports Delivered to Australia"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              {settings?.heroSubtitle || "Your direct bridge to the Japanese car market. We source, ship, and comply the finest JDM vehicles for Australian roads."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/cars">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-bold bg-primary text-primary-foreground border-2 border-primary shadow-xl hover:scale-105 transition-transform"
                >
                  Explore Inventory
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/find-me-a-car">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-bold text-white border-2 border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition-transform"
                >
                  Find Me a Car
                </Button>
              </Link>
            </div>

            <Card className="p-6 bg-background/95 backdrop-blur-md border-primary/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={heroCategory} onValueChange={setHeroCategory}>
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sports">Sports / Performance</SelectItem>
                    <SelectItem value="sedan">Premium Sedans</SelectItem>
                    <SelectItem value="suv">Luxury SUVs</SelectItem>
                    <SelectItem value="van">Luxury MPVs / Vans</SelectItem>
                    <SelectItem value="electric">Electric / Hybrid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={heroTransmission} onValueChange={setHeroTransmission}>
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transmissions</SelectItem>
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
                  <Button className="w-full font-bold" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    Search Inventory
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Latest Arrivals</h2>
              <p className="text-lg text-muted-foreground">
                High-quality vehicles recently sourced or ready for import
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
                    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full border-2 hover:border-primary/50 transition-colors">
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
                            <h3 className="text-xl font-bold mb-1">
                              {car.name}
                            </h3>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                                {car.category}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight border-blue-500 text-blue-500">
                                {car.year}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                          {car.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                          <div className="flex items-center gap-1.5">
                            <SeatsIcon className="h-3.5 w-3.5" />
                            <span>{car.seats}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Settings className="h-3.5 w-3.5" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Fuel className="h-3.5 w-3.5" />
                            <span>{car.fuelType}</span>
                          </div>
                        </div>
                        <Button className="w-full font-bold group">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/cars">
                <Button size="lg" variant="outline" className="px-8 font-bold">
                  View Full Inventory
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-card" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">The Direct Import Process</h2>
              <p className="text-lg text-muted-foreground">
                We handle the entire journey from Tokyo to your driveway
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform shadow-lg border border-primary/20">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1. Sourcing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We scout auctions and dealers across Japan to find the highest-grade vehicles that meet Australian import standards.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform shadow-lg border border-primary/20">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">2. Shipping & Export</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We manage all documentation, de-registration, and secure shipping ensuring your vehicle is fully insured during transit to Australia.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center rotate-6 hover:rotate-0 transition-transform shadow-lg border border-primary/20">
                  <CarIcon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">3. Compliance & Delivery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our network of SEVS compliance workshops handles all modifications and roadworthy items for final registration in your state.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-6xl font-black text-primary mb-2 opacity-90">10+</div>
                <div className="text-sm uppercase font-bold tracking-widest text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-6xl font-black text-primary mb-2 opacity-90">500+</div>
                <div className="text-sm uppercase font-bold tracking-widest text-muted-foreground">Successfully Imported</div>
              </div>
              <div>
                <div className="text-6xl font-black text-primary mb-2 opacity-90">RAW</div>
                <div className="text-sm uppercase font-bold tracking-widest text-muted-foreground">Compliance Network</div>
              </div>
              <div>
                <div className="text-6xl font-black text-primary mb-2 opacity-90">100%</div>
                <div className="text-sm uppercase font-bold tracking-widest text-muted-foreground">Grade Certified</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Australian Client Testimonials</h2>
              <p className="text-lg text-muted-foreground">
                Join the hundreds of satisfied owners across Australia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-l-4 border-primary">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold border-2 border-primary/20">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Mark Henderson</h4>
                    <p className="text-sm text-muted-foreground">Skyline R34 Owner, Brisbane</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "The transparency during the sourcing process was incredible. I received photos and auction sheets for every car we looked at. My Skyline arrived in better condition than the auction grade led me to believe. Highly recommended!"
                </p>
              </Card>

              <Card className="p-8 border-l-4 border-primary">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold border-2 border-primary/20">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Alicia Chen</h4>
                    <p className="text-sm text-muted-foreground">Alphard Executive Owner, Melbourne</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "Importing a family van seemed daunting, but the team handled everything from the compliance to the interior detailing. It was road-ready and delivered to my door in Melbourne without any stress."
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section
          className="relative py-32 px-6 overflow-hidden"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Can't find your dream car?
            </h2>
            <p className="text-2xl text-white/90 mb-12 font-medium">
              Our concierge service can source any vehicle directly from Japan to your exact specifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/find-me-a-car">
                <Button
                  size="lg"
                  className="px-10 py-8 text-xl font-black bg-white text-black hover:bg-slate-100 border-0 shadow-2xl hover:scale-105 transition-transform"
                >
                  Start Sourcing Request
                </Button>
              </Link>
              <Link href="/cars">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-8 text-xl font-bold text-white border-2 border-white/50 bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform"
                >
                  View Inventory
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
