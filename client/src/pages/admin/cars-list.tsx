import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Car } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { deleteCarFirebase, getAllCarsFirebase } from "@/lib/carsFirebase";
import { getThumbnailUrl } from "@/lib/imageUtils";

export default function CarsList() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: getAllCarsFirebase,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCarFirebase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["carById"] });
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
      setDeleteId(null);
    },
    onError: (error: unknown) => {
      console.error("Delete mutation error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete car";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setDeleteId(null);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Cars</h1>
          <p className="text-muted-foreground">View and manage all vehicles in your fleet</p>
        </div>
        <Link href="/admin/cars/new">
          <Button size="lg" data-testid="button-add-car">
            <Plus className="mr-2 h-4 w-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-24 rounded-md" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => {
                  if (!car.id) {
                    console.warn("Car missing ID:", car);
                  }
                  return (
                  <TableRow 
                    key={car.id || car.slug} 
                    data-testid={`row-car-${car.id || car.slug}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      // Don't navigate if clicking on action buttons
                      const target = e.target as HTMLElement;
                      if (target.closest('button') || target.closest('a')) {
                        return;
                      }
                      if (!car.id) {
                        console.error("Cannot edit car without ID:", car);
                        toast({
                          title: "Error",
                          description: "Car ID is missing. Please refresh the page.",
                          variant: "destructive",
                        });
                        return;
                      }
                      setLocation(`/admin/cars/${car.id}/edit`);
                    }}
                  >
                    <TableCell>
                      <div className="w-24 h-16 rounded-md overflow-hidden border">
                        <img
                          src={getThumbnailUrl(car.image, 320)}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{car.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{car.category}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${car.pricePerDay}</TableCell>
                    <TableCell>
                      <Badge variant={car.available ? "default" : "secondary"}>
                        {car.available ? "Available" : "Booked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/cars/${car.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" data-testid={`button-view-${car.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={car.id ? `/admin/cars/${car.id}/edit` : '#'}>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            data-testid={`button-edit-${car.id || car.slug}`}
                            disabled={!car.id}
                            onClick={(e) => {
                              if (!car.id) {
                                e.preventDefault();
                                toast({
                                  title: "Error",
                                  description: "Car ID is missing. Please refresh the page.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (!car.id) {
                              toast({
                                title: "Error",
                                description: "Car ID is missing. Cannot delete.",
                                variant: "destructive",
                              });
                              return;
                            }
                            setDeleteId(car.id);
                          }}
                          disabled={!car.id}
                          data-testid={`button-delete-${car.id || car.slug}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle
              from your fleet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteId) {
                  toast({
                    title: "Error",
                    description: "Car ID is missing. Cannot delete.",
                    variant: "destructive",
                  });
                  return;
                }
                console.log("Deleting car with ID:", deleteId);
                deleteMutation.mutate(deleteId);
              }}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}