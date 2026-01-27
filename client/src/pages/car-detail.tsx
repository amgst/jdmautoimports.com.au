import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Car, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Fuel,
  Settings,
  Users as SeatsIcon,
  Luggage,
  DoorOpen,
  Calendar as CalendarIcon,
  Navigation,
  Bluetooth,
  Wind,
  Usb,
  Check,
} from "lucide-react";
import { getCarBySlugFirebase } from "@/lib/carsFirebase";
import { BookingForm } from "@/components/booking-form";
import { getOptimizedImageUrl, getThumbnailUrl } from "@/lib/imageUtils";
import { getPricingSettings } from "@/lib/pricingSettingsFirebase";
import { getBookingsByCarFirebase } from "@/lib/bookingsFirebase";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SEO } from "@/components/seo";

export default function CarDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [estimatorDays, setEstimatorDays] = useState(3);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeDelivery, setIncludeDelivery] = useState(false);

  // Interactive Calendar State
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: car, isLoading } = useQuery({
    queryKey: ["carBySlug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const result = await getCarBySlugFirebase(slug!);
      if (!result) throw new Error("Car not found");
      return result;
    },
  });

  const { data: pricingSettings } = useQuery({
    queryKey: ["pricingSettings"],
    queryFn: () => getPricingSettings(),
  });

  const { data: carBookings } = useQuery<Booking[]>({
    queryKey: ["bookingsByCar", car?.id],
    enabled: !!car?.id,
    queryFn: () => getBookingsByCarFirebase(car!.id),
  });

  // Combine main image with additional images, filter out empty strings and duplicates
  // This needs to be calculated before early returns to avoid hook order issues
  const allImages = car
    ? [
      car.image,
      ...(car.images || []).filter((img) => img && img.trim() !== ""),
    ].filter((img) => img && img.trim() !== "")
    : [];

  const uniqueImages = allImages.filter(
    (image, index) => allImages.indexOf(image) === index,
  );

  const bookedRanges = useMemo(() => {
    if (!carBookings) return [];
    return carBookings.map((booking) => ({
      from: new Date(booking.startDate),
      to: new Date(booking.endDate),
    }));
  }, [carBookings]);

  const upcomingBookings = useMemo(() => {
    if (!carBookings) return [];
    return carBookings.slice(0, 3);
  }, [carBookings]);

  // Use pricing settings from Firebase, fallback to defaults
  const insuranceRatePerDay = pricingSettings?.insuranceRatePerDay ?? 25;
  const deliveryFlatRate = pricingSettings?.deliveryFlatRate ?? 75;
  const minDays = pricingSettings?.minimumRentalDays ?? 1;
  const maxDays = pricingSettings?.maximumRentalDays ?? 30;
  const taxRate = pricingSettings?.taxRate ?? 0;
  const enableInsurance = pricingSettings?.enableInsurance ?? true;
  const enableDelivery = pricingSettings?.enableDelivery ?? true;
  const enableTax = pricingSettings?.enableTax ?? false;

  const safeDays = Math.max(minDays, Math.min(maxDays, estimatorDays || minDays));
  const baseEstimate = car ? car.pricePerDay * safeDays : 0;
  const insuranceEstimate =
    includeInsurance && car && enableInsurance ? insuranceRatePerDay * safeDays : 0;
  const deliveryEstimate = includeDelivery && enableDelivery ? deliveryFlatRate : 0;
  const subtotal = baseEstimate + insuranceEstimate + deliveryEstimate;
  const taxAmount = enableTax ? (subtotal * taxRate) / 100 : 0;
  const totalEstimate = subtotal + taxAmount;

  // Reset selected image when car changes
  useEffect(() => {
    if (uniqueImages.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [car?.id, uniqueImages.length]);

  // Generate SEO data for this car
  const seoTitle = car ? `${car.name} - JDM Auto Imports` : "Car Details - JDM Auto Imports";
  const seoDescription = car
    ? `Rent ${car.name} from JDM Auto Imports. ${car.description} Starting at $${car.pricePerDay}/day. Book now for best rates and flexible booking options.`
    : "Browse JDM and premium car rental options in Australia";

  if (isLoading) {
    return (
      <>
        <SEO title="Loading Car Details" description="JDM Auto Imports - Premium Car Rentals" />
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-64 w-full rounded-xl mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link href="/cars">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Fleet
            </Button>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />
      <div className="bg-background">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[420px] w-full text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getOptimizedImageUrl(car.image, { width: 2400 })})` }}
            data-testid="img-car-main"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-between py-10">
            <div>
              <Link href="/cars">
                <Button
                  variant="outline"
                  className="mb-6 bg-black/40 border-white/40 text-white hover:bg-black/60"
                  data-testid="button-back-to-cars"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Fleet
                </Button>
              </Link>
            </div>

            <div className="pb-6">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70 mb-2">
                Luxury · Model Year {car.year}
              </p>
              <h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3"
                data-testid="text-car-name"
              >
                {car.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {car.category}
                </Badge>
                <Badge
                  variant={car.available ? "default" : "secondary"}
                  className={car.available ? "bg-emerald-500" : "bg-gray-500"}
                >
                  {car.available ? "Available" : "Booked"}
                </Badge>
                <span className="text-white/80">
                  <span className="text-3xl md:text-4xl font-semibold align-middle mr-1"
                    data-testid="text-car-price"
                  >
                    ${car.pricePerDay}
                  </span>
                  <span className="text-base md:text-lg text-white/70">
                    / day rental
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Key highlights row */}
        <section className="bg-card border-b">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Seats
              </p>
              <p className="text-lg font-semibold">{car.seats} People</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Transmission
              </p>
              <p className="text-lg font-semibold">{car.transmission}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Fuel Type
              </p>
              <p className="text-lg font-semibold">{car.fuelType}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Luggage
              </p>
              <p className="text-lg font-semibold">{car.luggage} Bags</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Doors
              </p>
              <p className="text-lg font-semibold">{car.doors}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            {/* Overview & Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <h2 className="text-xl md:text-2xl font-semibold mb-3">
                  Overview & Introduction
                </h2>
                <Separator className="mb-4" />
                <p
                  className="text-muted-foreground leading-relaxed text-sm md:text-base"
                  data-testid="text-car-description"
                >
                  {car.description}
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-5 shadow-sm">
                  <h3 className="text-base font-semibold mb-3">Quick Facts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <SeatsIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Up to {car.seats} passengers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {car.transmission} transmission
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {car.fuelType} powertrain
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Model year {car.year}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Features columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-semibold mb-3">Primary Features</h3>
                <Separator className="mb-4" />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Premium interior with comfortable seating for {car.seats}</li>
                  <li>Smooth {car.transmission.toLowerCase()} transmission for city and highway</li>
                  <li>Efficient {car.fuelType.toLowerCase()} powertrain for everyday use</li>
                  <li>Spacious luggage area with capacity for {car.luggage} bags</li>
                  <li>Modern safety and comfort features for all passengers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Features</h3>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  {car.hasGPS && <p>Integrated GPS navigation system</p>}
                  {car.hasBluetooth && <p>Bluetooth connectivity for hands‑free calls and media</p>}
                  {car.hasAC && <p>Automatic climate control / air conditioning</p>}
                  {car.hasUSB && <p>USB charging ports for devices</p>}
                  {!(car.hasGPS || car.hasBluetooth || car.hasAC || car.hasUSB) && (
                    <p>Equipped with essential comfort and convenience features.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image gallery */}
            {uniqueImages.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold">Gallery</h2>
                <Separator />

                <div className="grid grid-cols-1 gap-4">
                  {/* Large main image - updates when thumbnail is clicked */}
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                    <img
                      src={getOptimizedImageUrl(uniqueImages[selectedImageIndex] || uniqueImages[0], {
                        width: 1600,
                      })}
                      alt={`${car.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Thumbnails - carousel for mobile, grid for desktop */}
                  {uniqueImages.length > 1 && (
                    <>
                      <div className="hidden md:grid grid-cols-3 md:grid-cols-6 gap-3">
                        {uniqueImages.map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className={`aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer transition-all duration-200 ${selectedImageIndex === index
                              ? "ring-2 ring-primary ring-offset-2 opacity-100"
                              : "hover:opacity-90 opacity-70"
                              }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              src={getThumbnailUrl(image, 320)}
                              alt={`${car.name} thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Hide broken images
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="md:hidden">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {uniqueImages.map((image, index) => (
                              <CarouselItem key={`${image}-${index}`} className="basis-1/3">
                                <div
                                  className={`aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer transition-all duration-200 ${selectedImageIndex === index
                                    ? "ring-2 ring-primary ring-offset-2 opacity-100"
                                    : "hover:opacity-90 opacity-70"
                                    }`}
                                  onClick={() => setSelectedImageIndex(index)}
                                >
                                  <img
                                    src={getThumbnailUrl(image, 320)}
                                    alt={`${car.name} thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Hide broken images
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Price estimator */}
            {car && (
              <Card className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Quick Price Estimator</h2>
                    <p className="text-sm text-muted-foreground">
                      Get a rough idea of your rental cost before booking. Final pricing may vary
                      based on availability and seasonal adjustments.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Daily rate</p>
                    <p className="text-2xl font-bold">${car.pricePerDay}/day</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Rental length (days)
                    </label>
                    <Input
                      type="number"
                      min={minDays}
                      max={maxDays}
                      value={safeDays}
                      onChange={(e) =>
                        setEstimatorDays(Math.max(minDays, Math.min(maxDays, e.target.valueAsNumber || minDays)))
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Between {minDays} and {maxDays} days
                    </p>
                  </div>

                  {enableInsurance && (
                    <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Premium insurance</p>
                        <p className="text-xs text-muted-foreground">
                          ${insuranceRatePerDay}/day damage coverage
                        </p>
                      </div>
                      <Switch
                        checked={includeInsurance}
                        onCheckedChange={setIncludeInsurance}
                        data-testid="switch-insurance"
                      />
                    </div>
                  )}

                  {enableDelivery && (
                    <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Delivery & pickup</p>
                        <p className="text-xs text-muted-foreground">
                          Flat ${deliveryFlatRate} concierge delivery
                        </p>
                      </div>
                      <Switch
                        checked={includeDelivery}
                        onCheckedChange={setIncludeDelivery}
                        data-testid="switch-delivery"
                      />
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 space-y-2 bg-muted/40">
                  <div className="flex items-center justify-between text-sm">
                    <span>Base ({safeDays} {safeDays === 1 ? "day" : "days"})</span>
                    <span className="font-semibold">${baseEstimate.toLocaleString()}</span>
                  </div>
                  {enableInsurance && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Insurance add-on</span>
                      <span className="font-semibold">
                        {includeInsurance ? `$${insuranceEstimate.toLocaleString()}` : "$0"}
                      </span>
                    </div>
                  )}
                  {enableDelivery && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Delivery service</span>
                      <span className="font-semibold">
                        {includeDelivery ? `$${deliveryEstimate.toLocaleString()}` : "$0"}
                      </span>
                    </div>
                  )}
                  {enableTax && taxAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-semibold">${taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Estimated total</span>
                    <span className="text-2xl font-bold">${totalEstimate.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Technical specifications row */}
            <Card className="p-6 md:p-8 bg-card">
              <h2 className="text-xl font-semibold mb-6">Technical Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Seats
                  </p>
                  <p className="font-semibold">{car.seats}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Transmission
                  </p>
                  <p className="font-semibold">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Fuel Type
                  </p>
                  <p className="font-semibold">{car.fuelType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Year
                  </p>
                  <p className="font-semibold">{car.year}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Doors
                  </p>
                  <p className="font-semibold">{car.doors}</p>
                </div>
              </div>
            </Card>

            {/* Availability Calendar */}
            <Card className="mt-4 md:mt-8">
              <div className="p-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">Availability Calendar</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Dates marked in red are already booked for this vehicle.
                  </p>
                  <div className="flex justify-center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => {
                        // Disable past dates
                        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
                        // Disable booked dates
                        return bookedRanges.some(range =>
                          date >= range.from && date <= range.to
                        );
                      }}
                      modifiers={{ booked: bookedRanges }}
                      modifiersClassNames={{
                        booked: "bg-destructive/10 text-destructive font-medium line-through decoration-destructive",
                      }}
                      className="rounded-md border shadow-sm"
                      classNames={{
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                      }}
                    />
                  </div>

                  {dateRange?.from && dateRange?.to && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border flex items-center justify-between max-w-lg mx-auto">
                      <div>
                        <p className="text-sm font-medium">Selected Dates</p>
                        <p className="text-sm text-muted-foreground">
                          {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsBookingOpen(true)}
                        size="sm"
                      >
                        Book These Dates
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Booking CTA */}
            <Card className="mt-4 md:mt-8 p-8 text-center">
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold">
                  Ready to book our car
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Share your trip dates and requirements and our team will help you
                  finalize the perfect rental package for this vehicle.
                </p>
                <Button
                  className="w-full sm:w-auto px-10"
                  size="lg"
                  disabled={!car.available}
                  onClick={() => setIsBookingOpen(true)}
                  data-testid="button-book-car"
                >
                  <Check className="mr-2 h-5 w-5" />
                  {car.available ? "Book This Car" : "Currently Unavailable"}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Booking Form Dialog */}
        {car && (
          <BookingForm
            carId={car.id}
            carName={car.name}
            pricePerDay={car.pricePerDay}
            open={isBookingOpen}
            onOpenChange={setIsBookingOpen}
            initialDateRange={dateRange}
          />
        )}
      </div>
    </>
  );
}