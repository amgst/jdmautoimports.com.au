import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  getWebsiteSettings,
  saveWebsiteSettings,
  type WebsiteSettings,
} from "@/lib/websiteSettingsFirebase";
import { Save, Upload, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImage, isImageFile, isValidFileSize } from "@/lib/imageUpload";

// Custom URL validator that accepts both full URLs and relative paths
const urlOrPath = z.string().refine(
  (val) => {
    if (!val || val.trim() === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true; // Valid absolute URL
    } catch {
      return val.startsWith("/") || val.startsWith("./") || val.startsWith("../") || val.startsWith("#");
    }
  },
  {
    message: "Must be a valid URL, relative path, or anchor link (starting with / or #)",
  }
);

const websiteSettingsSchema = z.object({
  websiteName: z.string().min(1, "Website name is required"),
  logo: urlOrPath.or(z.literal("")),
  favicon: urlOrPath.or(z.literal("")),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  facebookUrl: urlOrPath.or(z.literal("")),
  xUrl: urlOrPath.or(z.literal("")),
  instagramUrl: urlOrPath.or(z.literal("")),
  linkedinUrl: urlOrPath.or(z.literal("")),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),

  // Hero Section
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: urlOrPath.or(z.literal("")),
  heroButtonText: z.string().optional(),
  heroButtonLink: urlOrPath.or(z.literal("")),
  heroLearnMoreText: z.string().optional(),
  heroLearnMoreLink: urlOrPath.or(z.literal("")),

  // Pages
  termsAndConditions: z.string().optional(),
});

type WebsiteSettingsForm = z.infer<typeof websiteSettingsSchema>;

export default function WebsiteSettings() {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Hero Image State
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);

  const { data: settings, isLoading } = useQuery<WebsiteSettings>({
    queryKey: ["websiteSettings"],
    queryFn: getWebsiteSettings,
  });

  const form = useForm<WebsiteSettingsForm>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: {
      websiteName: "Premium Car Rentals Australia",
      logo: "",
      favicon: "/favicon.png",
      companyName: "Premium Car Rentals Australia",
      email: "info@premiumcarrentals.com.au",
      phone: "+61 2 9999 8888",
      address: "123 Premium Street, Sydney, NSW 2000, Australia",
      description: "Australia's premier car rental service offering luxury vehicles, premium sedans, SUVs, and sports cars. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      metaDescription: "Premium car rental in Australia. Choose from luxury sedans, SUVs, sports cars and more. Best rates, flexible bookings, and exceptional service across Sydney, Melbourne, Brisbane, Perth, and Adelaide. Book your dream car today.",
      metaKeywords: "car rental Australia, luxury car hire Australia, premium car rental Sydney, car hire Melbourne, rent car Brisbane, vehicle rental Perth, car rental Adelaide, Australia car hire, premium vehicles Australia, luxury cars Australia",

      // Hero Defaults
      heroTitle: "Premium Car Rentals Australia",
      heroSubtitle: "Experience luxury and performance with Australia's finest collection of premium vehicles. Available across Sydney, Melbourne, Brisbane, Perth, and Adelaide.",
      heroImage: "",
      heroButtonText: "Browse Our Fleet",
      heroButtonLink: "/cars",
      heroLearnMoreText: "Learn More",
      heroLearnMoreLink: "#features",

      // Pages
      termsAndConditions: "",
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        websiteName: settings.websiteName,
        logo: settings.logo || "",
        favicon: settings.favicon || "/favicon.png",
        companyName: settings.companyName,
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        description: settings.description || "",
        facebookUrl: settings.facebookUrl || "",
        xUrl: settings.xUrl || "",
        instagramUrl: settings.instagramUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",

        // Hero
        heroTitle: settings.heroTitle || "Premium Car Rentals Australia",
        heroSubtitle: settings.heroSubtitle || "Experience luxury and performance with Australia's finest collection of premium vehicles. Available across Sydney, Melbourne, Brisbane, Perth, and Adelaide.",
        heroImage: settings.heroImage || "",
        heroButtonText: settings.heroButtonText || "Browse Our Fleet",
        heroButtonLink: settings.heroButtonLink || "/cars",
        heroLearnMoreText: settings.heroLearnMoreText || "Learn More",
        heroLearnMoreLink: settings.heroLearnMoreLink || "#features",

        // Pages
        termsAndConditions: settings.termsAndConditions || "",
      });
      if (settings.logo) {
        setLogoPreview(settings.logo);
      }
      if (settings.favicon) {
        setFaviconPreview(settings.favicon);
      }
      if (settings.heroImage) {
        setHeroImagePreview(settings.heroImage);
      }
    }
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: (data: WebsiteSettingsForm) => {
      // Clean up empty strings for optional fields
      const cleanedData: WebsiteSettings = {
        websiteName: data.websiteName,
        logo: data.logo || "",
        favicon: data.favicon || "/favicon.png",
        companyName: data.companyName,
        email: data.email || "",
        phone: data.phone,
        address: data.address,
        description: data.description,
        facebookUrl: data.facebookUrl || undefined,
        xUrl: data.xUrl || undefined,
        instagramUrl: data.instagramUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        metaDescription: data.metaDescription || undefined,
        metaKeywords: data.metaKeywords || undefined,

        // Hero Section
        heroTitle: data.heroTitle || undefined,
        heroSubtitle: data.heroSubtitle || undefined,
        heroImage: data.heroImage || "", // Use empty string for image to clear it if needed
        heroButtonText: data.heroButtonText || undefined,
        heroButtonLink: data.heroButtonLink || undefined,
        heroLearnMoreText: data.heroLearnMoreText || undefined,
        heroLearnMoreLink: data.heroLearnMoreLink || undefined,

        // Pages
        termsAndConditions: data.termsAndConditions || undefined,
      };
      return saveWebsiteSettings(cleanedData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["websiteSettings"] });
      toast({
        title: "Success",
        description: "Website settings saved successfully",
      });
      // Update document title if available
      if (typeof document !== "undefined") {
        document.title = `${data.websiteName} - Premium Car Rentals`;
      }
    },
    onError: (error: unknown) => {
      console.error("Error saving website settings:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to save website settings. Please check the console for details.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      if (!isValidFileSize(file)) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      if (!isValidFileSize(file)) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFaviconFile(file);
      const preview = URL.createObjectURL(file);
      setFaviconPreview(preview);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    form.setValue("logo", "");
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    form.setValue("favicon", "/favicon.png");
  };

  const uploadLogo = async (silent: boolean = false): Promise<string | null> => {
    if (!logoFile) return null;
    setIsUploadingLogo(true);
    try {
      const url = await uploadImage(logoFile);
      form.setValue("logo", url);
      setLogoFile(null);
      if (!silent) {
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        });
      }
      return url;
    } catch (error) {
      console.error("Logo upload error:", error);
      if (!silent) {
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload logo",
          variant: "destructive",
        });
      }
      throw error; // Re-throw so onSubmit can handle it
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const uploadFavicon = async (silent: boolean = false): Promise<string | null> => {
    if (!faviconFile) return null;
    setIsUploadingFavicon(true);
    try {
      const url = await uploadImage(faviconFile);
      form.setValue("favicon", url);
      setFaviconFile(null);
      if (!silent) {
        toast({
          title: "Success",
          description: "Favicon uploaded successfully",
        });
      }
      return url;
    } catch (error) {
      console.error("Favicon upload error:", error);
      if (!silent) {
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload favicon",
          variant: "destructive",
        });
      }
      throw error; // Re-throw so onSubmit can handle it
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      if (!isValidFileSize(file)) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setHeroImageFile(file);
      const preview = URL.createObjectURL(file);
      setHeroImagePreview(preview);
    }
  };

  const removeHeroImage = () => {
    setHeroImageFile(null);
    setHeroImagePreview(null);
    form.setValue("heroImage", "");
  };

  const uploadHeroImage = async (silent: boolean = false): Promise<string | null> => {
    if (!heroImageFile) return null;
    setIsUploadingHeroImage(true);
    try {
      const url = await uploadImage(heroImageFile);
      form.setValue("heroImage", url);
      setHeroImageFile(null);
      if (!silent) {
        toast({
          title: "Success",
          description: "Hero image uploaded successfully",
        });
      }
      return url;
    } catch (error) {
      console.error("Hero image upload error:", error);
      if (!silent) {
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload hero image",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsUploadingHeroImage(false);
    }
  };

  const onSubmit = async (data: WebsiteSettingsForm) => {
    try {
      let uploadErrors: string[] = [];

      // Upload logo if a new file was selected (silent mode - no toast during submit)
      if (logoFile) {
        try {
          const logoUrl = await uploadLogo(true);
          if (logoUrl) {
            data.logo = logoUrl;
          }
        } catch (error) {
          uploadErrors.push("Logo upload failed");
          console.error("Logo upload error:", error);
          // Keep existing logo value if upload fails
          if (data.logo) {
            // Use existing value
          } else {
            data.logo = ""; // Ensure empty string if no existing value
          }
        }
      }

      // Upload favicon if a new file was selected (silent mode - no toast during submit)
      if (faviconFile) {
        try {
          const faviconUrl = await uploadFavicon(true);
          if (faviconUrl) {
            data.favicon = faviconUrl;
          }
        } catch (error) {
          uploadErrors.push("Favicon upload failed");
          console.error("Favicon upload error:", error);
          // Keep existing favicon value if upload fails
          if (data.favicon) {
            // Use existing value
          } else {
            data.favicon = "/favicon.png"; // Use default if no existing value
          }
        }
      }

      // Upload hero image if a new file was selected
      if (heroImageFile) {
        try {
          const heroImageUrl = await uploadHeroImage(true);
          if (heroImageUrl) {
            data.heroImage = heroImageUrl;
          }
        } catch (error) {
          uploadErrors.push("Hero image upload failed");
          console.error("Hero image upload error:", error);
          // Keep existing value
          if (!data.heroImage) {
            data.heroImage = "";
          }
        }
      }

      // Show warning if uploads failed but still save other settings
      if (uploadErrors.length > 0) {
        toast({
          title: "Upload Warning",
          description: `${uploadErrors.join(", ")}. Other settings will still be saved.`,
          variant: "destructive",
        });
      }

      // Save the settings (this will use existing logo/favicon if uploads failed)
      console.log("Saving website settings:", data);
      saveMutation.mutate(data);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    }
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
        <h1 className="text-4xl font-bold mb-2">Website Settings</h1>
        <p className="text-muted-foreground">
          Configure basic website information, branding, and contact details
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Set your website name, logo, and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="websiteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tokyo Drive" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name displayed in the browser title and navigation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tokyo Drive" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your official company name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="flex-1"
                          />
                          {(logoPreview || field.value) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={removeLogo}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {(logoPreview || field.value) && (
                          <div className="relative w-48 h-32 border rounded-md overflow-hidden bg-muted">
                            <img
                              src={logoPreview || field.value}
                              alt="Logo preview"
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        )}
                        <Input
                          type="text"
                          placeholder="https://example.com/logo.png or /logo.png"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a logo image or enter a URL/path. Recommended size: 200x60px
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconChange}
                            className="flex-1"
                          />
                          {(faviconPreview || field.value) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={removeFavicon}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {(faviconPreview || field.value) && (
                          <div className="relative w-16 h-16 border rounded-md overflow-hidden bg-muted">
                            <img
                              src={faviconPreview || field.value}
                              alt="Favicon preview"
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        )}
                        <Input
                          type="text"
                          placeholder="/favicon.png"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a favicon image or enter a URL/path. Recommended size: 32x32px or 64x64px
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Premium car rental service with the finest vehicles..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Set your contact details displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 234-567-8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Street Name, City, Country"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Add links to your social media profiles (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://facebook.com/yourpage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="xUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>X (Twitter) URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://x.com/yourcompany" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://instagram.com/yourhandle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://linkedin.com/company/yourcompany" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Customize the main banner on the home page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="heroTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Premium Car Rentals Australia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Subtitle</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Experience luxury and performance..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Background Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageChange}
                            className="flex-1"
                          />
                          {(heroImagePreview || field.value) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={removeHeroImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {(heroImagePreview || field.value) && (
                          <div className="relative w-full h-48 border rounded-md overflow-hidden bg-muted">
                            <img
                              src={heroImagePreview || field.value}
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Input
                          type="text"
                          placeholder="https://example.com/banner.jpg"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a high-quality banner image (recommended 1920x1080px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Primary Button</h3>
                  <FormField
                    control={form.control}
                    name="heroButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Browse Our Fleet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroButtonLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/cars" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Secondary Button (Learn More)</h3>
                  <FormField
                    control={form.control}
                    name="heroLearnMoreText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Learn More" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroLearnMoreLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="#features" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure meta tags for search engines (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Discover our premium car rental collection..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description shown in search engine results (150-160 characters recommended)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="car rental, luxury cars, premium vehicles" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords for SEO
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pages Content</CardTitle>
              <CardDescription>
                Edit the content for specific pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter terms and conditions content using Markdown..."
                        className="min-h-[300px] font-mono text-sm"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Use Markdown for formatting (## for headers, * for lists)
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
              disabled={saveMutation.isPending || isUploadingLogo || isUploadingFavicon || isUploadingHeroImage}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveMutation.isPending || isUploadingLogo || isUploadingFavicon || isUploadingHeroImage
                ? "Saving..."
                : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
