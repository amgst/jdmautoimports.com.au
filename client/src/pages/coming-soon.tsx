import { motion } from "framer-motion";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ComingSoon() {
    const { websiteName, logo, email, phone, address, companyName } = useWebsiteSettings();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl w-full text-center z-10"
            >
                {logo ? (
                    <img src={logo} alt={websiteName} className="h-16 md:h-20 mx-auto mb-8 object-contain" />
                ) : (
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                        {websiteName}
                    </h2>
                )}

                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                    System Maintenance
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                    We're making things <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Even Better
                    </span>
                </h1>

                <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                    Our website is currently undergoing scheduled maintenance to improve your experience.
                    We'll be back online shortly. Thank you for your patience!
                </p>

                {/* Contact info grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {email && (
                        <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
                            <Mail className="h-5 w-5 text-blue-400 mb-2" />
                            <span className="text-sm font-medium">{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
                            <Phone className="h-5 w-5 text-blue-400 mb-2" />
                            <span className="text-sm font-medium">{phone}</span>
                        </div>
                    )}
                    {address && (
                        <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
                            <MapPin className="h-5 w-5 text-blue-400 mb-2" />
                            <span className="text-sm font-medium line-clamp-1">{address}</span>
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-white/10">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
