import { motion } from "framer-motion";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ComingSoon() {
    const { isLoading, ...settings } = useWebsiteSettings();
    const { websiteName, logo, companyName } = settings;
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

                {/* Contact information removed at user request */}

                <div className="pt-8 border-t border-white/10">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} {websiteName || companyName}. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
