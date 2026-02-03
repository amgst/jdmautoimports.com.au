import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Car } from "@shared/schema";
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
import {
  ArrowLeft,
  Fuel,
  Settings,
  Users as SeatsIcon,
  Calendar as CalendarIcon,
  Check,
  Send,
  Info,
  Droplets,
  Zap,
  Activity,
  Maximize2,
  Palette,
  Calendar,
} from "lucide-react";
import { getCarBySlugFirebase } from "@/lib/carsFirebase";
import { InquiryForm } from "@/components/inquiry-form";
import { getOptimizedImageUrl, getThumbnailUrl } from "@/lib/imageUtils";
import { SEO } from "@/components/seo";

export default function CarDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const { data: car, isLoading } = useQuery({
    queryKey: ["carBySlug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const result = await getCarBySlugFirebase(slug!);
      if (!result) throw new Error("Car not found");
      return result;
    },
  });

  // Combine main image with additional images, filter out empty strings and duplicates
  const allImages = car
    ? [
      car.image,
      ...(car.images || []).filter((img) => img && img.trim() !== ""),
    ].filter((img) => img && img.trim() !== "")
    : [];

  const uniqueImages = allImages.filter(
    (image, index) => allImages.indexOf(image) === index,
  );

  // Reset selected image when car changes
  useEffect(() => {
    if (uniqueImages.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [car?.id, uniqueImages.length]);

  // Generate SEO data for this car
  const seoTitle = car ? `${car.name} - JDM Auto Imports Australia` : "Car Details - JDM Auto Imports";
  const seoDescription = car
    ? `Direct JDM Import: ${car.name}. ${car.description} High-quality vehicle sourcing and compliance services for Australia. Inquire for pricing and import details.`
    : "Browse JDM and premium car import options for Australia";

  if (isLoading) {
    return (
      <>
        <SEO title="Loading Car Details" description="JDM Auto Imports - Premium JDM Imports" />
        <div className="min-h-screen bg-background text-left">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-64 w-full rounded-xl mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-left">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link href="/cars">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />
      <div className="bg-background text-left">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] w-full text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getOptimizedImageUrl(car.image, { width: 2400 })})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-between py-10">
            <div>
              <Link href="/cars">
                <Button
                  variant="outline"
                  className="mb-6 bg-black/40 border-white/40 text-white hover:bg-black/60"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Inventory
                </Button>
              </Link>
            </div>

            <div className="pb-6">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70 mb-2">
                JDM Import · {car.year} Model
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 uppercase">
                {car.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {car.category}
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  Ready for Import
                </Badge>
              </div>

              <div className="mt-8">
                <Link href={`/booking?car=${encodeURIComponent(car.name)}&id=${car.id}`}>
                  <Button
                    className="bg-[hsl(var(--booking-button))] hover:bg-[hsl(var(--booking-button))]/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book for Inspection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Column: Details & Gallery */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Vehicle Overview</h2>
                <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                  {car.description}
                </div>
              </div>

              {/* Technical Specifications Grid - Modern 6-Box Layout */}
              <div>
                <h2 className="text-2xl font-semibold mb-8">All technical specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Engine */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Maximize2 className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Engine</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.engine || "N/A"}</p>
                    </div>
                  </div>

                  {/* Power */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Zap className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Power</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.power || "N/A"}</p>
                    </div>
                  </div>

                  {/* Transmission */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Settings className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Transmission</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.transmission}</p>
                    </div>
                  </div>

                  {/* Drivetrain */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Activity className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Drivetrain</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.drivetrain || "N/A"}</p>
                    </div>
                  </div>

                  {/* Consumption */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Droplets className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Consumption</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.consumption || "N/A"}</p>
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                    <div className="p-3 rounded-xl bg-red-100 group-hover:bg-red-600 transition-colors duration-300">
                      <Fuel className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-1">Fuel Type</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{car.fuelType}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info (Seats & Colors) */}
                <div className="mt-8 flex flex-wrap gap-4 py-4 border-y border-slate-100">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <SeatsIcon className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <Palette className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Exterior: {car.exteriorColor || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <Palette className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Interior: {car.interiorColor || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              {uniqueImages.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Gallery</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                      <img
                        src={getOptimizedImageUrl(uniqueImages[selectedImageIndex] || uniqueImages[0], { width: 1600 })}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {uniqueImages.length > 1 && (
                      <div className="grid grid-cols-3 gap-3">
                        {uniqueImages.map((image, index) => (
                          <div
                            key={index}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${selectedImageIndex === index ? "border-red-600 scale-[0.98]" : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img src={getThumbnailUrl(image, 480)} alt="thumbnail" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Inquiry Action */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-24 border-2">
                <h3 className="text-xl font-bold mb-2">Import this Vehicle</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Interested in this {car.name}? Inquire now to get a full landing price estimate for Australia.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Verified auction condition report</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Australia-wide shipping & compliance</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Handling of all customs & taxes</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg font-semibold"
                  onClick={() => setIsInquiryOpen(true)}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Request Details
                </Button>

                <p className="text-[11px] text-center text-muted-foreground mt-4">
                  Typically responds within 24 hours
                </p>
              </Card>

              <Card className="p-6 bg-slate-50 border-none">
                <div className="flex gap-4 items-start">
                  <Info className="h-6 w-6 text-blue-600 shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Import Process</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All vehicles listed are sourced directly from Japan. Our service includes auction bidding, inland transport, shipping, and Australian compliance.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Inquiry Form Dialog */}
        <InquiryForm
          carId={car.id!}
          carName={car.name}
          open={isInquiryOpen}
          onOpenChange={setIsInquiryOpen}
        />
      </div>
    </>
  );
}
