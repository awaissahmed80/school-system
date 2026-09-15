import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout ({ children }) {
    
    return(
        <>
        <TooltipProvider>

            {children}
            {/* <Toaster /> */}
            <Toaster position="top-center" richColors />
        </TooltipProvider>
        </>
    )
}