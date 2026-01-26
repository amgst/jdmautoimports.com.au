import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Car } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Car as CarIcon, Plus, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { getThumbnailUrl } from "@/lib/imageUtils";
import { getAllCarsFirebase } from "@/lib/carsFirebase";

export default function AdminDashboard() {
  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: getAllCarsFirebase,
  });

  const stats = {
    total: cars?.length || 0,
    available: cars?.filter((car) => car.available).length || 0,
    booked: cars?.filter((car) => !car.available).length || 0,
    avgPrice: cars && cars.length > 0
      ? Math.round(cars.reduce((sum, car) => sum + car.pricePerDay, 0) / cars.length)
      : 0,
  };

  const recentCars = cars?.slice(0, 5) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your car rental management system</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CarIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-cars">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-available-cars">{stats.available}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Booked</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-booked-cars">{stats.booked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price/Day</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-avg-price">${stats.avgPrice}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Recent Vehicles</CardTitle>
          <Link href="/admin/cars/new">
            <Button data-testid="button-add-new-car">
              <Plus className="mr-2 h-4 w-4" />
              Add New Car
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No vehicles yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Get started by adding your first vehicle to the fleet
              </p>
              <Link href="/admin/cars/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Car
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCars.map((car) => (
                <Link key={car.id} href={`/admin/cars/${car.id}/edit`}>
                  <div className="flex items-center gap-4 p-4 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid={`row-car-${car.id}`}>
                    <div className="w-24 h-16 rounded-md overflow-hidden border flex-shrink-0">
                      <img
                        src={getThumbnailUrl(car.image, 320)}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{car.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {car.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${car.pricePerDay}/day
                        </span>
                      </div>
                    </div>
                    <Badge variant={car.available ? "default" : "secondary"}>
                      {car.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
