"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface SignupSuccessScreenProps {
  message?: string;
  redirectTo?: string;
  delay?: number;
}

export function SignupSuccessScreen({ 
  message = "Your account has been created successfully!", 
  redirectTo = "/dashboard",
  delay = 2500 
}: SignupSuccessScreenProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, delay);
    return () => clearTimeout(timer);
  }, [router, redirectTo, delay]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-card p-12 rounded-2xl shadow-2xl border flex flex-col items-center text-center max-w-md mx-4"
      >
        <div className="mb-6 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-primary/10 p-4 rounded-full"
          >
            <CheckCircle2 className="w-20 h-20 text-primary" />
          </motion.div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full -z-10"
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Success!</h1>
        <p className="text-muted-foreground text-lg mb-8">{message}</p>
        
        <div className="flex items-center gap-2 text-primary font-medium">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
          Redirecting to your dashboard...
        </div>
      </motion.div>
    </div>
  );
}
