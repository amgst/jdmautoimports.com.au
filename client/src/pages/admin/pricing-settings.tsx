import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  getPricingSettings,
  savePricingSettings,
  type PricingSettings,
} from "@/lib/pricingSettingsFirebase";
import { Save, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const pricingSettingsSchema = z.object({
  insuranceRatePerDay: z.number().min(0, "Insurance rate must be 0 or greater"),
  deliveryFlatRate: z.number().min(0, "Delivery rate must be 0 or greater"),
  minimumRentalDays: z.number().min(1, "Minimum rental days must be at least 1"),
  maximumRentalDays: z.number().min(1, "Maximum rental days must be at least 1"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  enableInsurance: z.boolean(),
  enableDelivery: z.boolean(),
  enableTax: z.boolean(),
});

type PricingSettingsForm = z.infer<typeof pricingSettingsSchema>;

export default function PricingSettings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<PricingSettings>({
    queryKey: ["pricingSettings"],
    queryFn: getPricingSettings,
  });

  const form = useForm<PricingSettingsForm>({
    resolver: zodResolver(pricingSettingsSchema),
    defaultValues: {
      insuranceRatePerDay: 25,
      deliveryFlatRate: 75,
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      taxRate: 10,
      enableInsurance: true,
      enableDelivery: true,
      enableTax: false,
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        insuranceRatePerDay: settings.insuranceRatePerDay,
        deliveryFlatRate: settings.deliveryFlatRate,
        minimumRentalDays: settings.minimumRentalDays,
        maximumRentalDays: settings.maximumRentalDays,
        taxRate: settings.taxRate,
        enableInsurance: settings.enableInsurance,
        enableDelivery: settings.enableDelivery,
        enableTax: settings.enableTax,
      });
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: (data: PricingSettingsForm) => savePricingSettings(data as PricingSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricingSettings"] });
      toast({
        title: "Success",
        description: "Pricing settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save pricing settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PricingSettingsForm) => {
    if (data.minimumRentalDays > data.maximumRentalDays) {
      toast({
        title: "Validation Error",
        description: "Minimum rental days cannot be greater than maximum rental days",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-48 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pricing Settings</h1>
        <p className="text-muted-foreground">
          Configure pricing options for the price estimator and booking system
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Settings</CardTitle>
              <CardDescription>
                Configure premium insurance options for rentals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableInsurance"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Insurance</FormLabel>
                      <FormDescription>
                        Allow customers to add premium insurance to their rental
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insuranceRatePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Rate Per Day ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Daily rate for premium insurance coverage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure delivery and pickup service options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableDelivery"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Delivery</FormLabel>
                      <FormDescription>
                        Allow customers to add concierge delivery service
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryFlatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Flat Rate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      One-time fee for delivery and pickup service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental Period Settings</CardTitle>
              <CardDescription>
                Set minimum and maximum rental periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="minimumRentalDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Rental Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum number of days for a rental
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximumRentalDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Rental Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of days for a rental
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax calculation for rentals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableTax"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Tax</FormLabel>
                      <FormDescription>
                        Include tax in price calculations
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Tax rate as a percentage (e.g., 10 for 10%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={saveMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

