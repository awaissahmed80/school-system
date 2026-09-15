import { Link } from "@inertiajs/react"
import RootLayout from "./root.layout"

// import { Toaster } from "@/components/ui/toast"
export default function AuthLayout ({ children }) {
        
    return(
        <RootLayout>
        <div className="h-dvh flex overflow-y-hidden">            
            <div className="flex flex-1 lg:flex-[0.5] relative items-center justify-center">                
                <div className="absolute items-center flex flex-col min-h-full  inset-0 overflow-y-auto">
                    <div className="w-full mx-auto py-8 px-5">
                        <Link href="/">                            
                            <img className="h-11 block mx-auto lg:mx-0" src="/images/axiom-logo.svg" alt="Axiom School" />                            
                        </Link>
                    </div>
                    <div className="w-full flex  justify-center flex-col flex-1 max-w-110 p-5 mx-auto">
                        {children}
                    </div>
                    <div className="p-5">
                        <div className="flex text-sm fex-row items-center space-x-5">
                            <a href="/">Terms & Conditions</a>
                            <a href="/">Privacy Policy</a>
                            <a href="/">Help</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 bg-card items-center justify-end">
                <img className="w-[80%] h-auto shadow-sm" src="/images/auth-bg-light.png" />
            </div>
            {/* <div className="hidden lg:flex lg:flex-[0.5] bg-[url('/assets/images/auth-bg.png')] bg-no-repeat bg-cover bg-center">
            
                
            </div> */}
            
        </div>
        {/* <Toaster /> */}
        </RootLayout>
    )
}