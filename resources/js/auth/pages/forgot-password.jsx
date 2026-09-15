import { useState } from "react";
import AuthLayout from "@/layouts/auth.layout";
import { Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { TextLink } from "@/components/ui/text-link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp"


export default function ForgotPassword ({ status, step, error }) {

    
    const { handleSubmit, register, reset, watch, setValue } = useForm()    
    const [ loading, setLoading ] = useState(false)
    const [ email_address, setEmailAddress ] = useState(null)

    const onSubmit = (data) => {                
        setLoading(true)
        router.post('/forgot-password', data, {
            onSuccess: () => {     
                setEmailAddress(data?.email_address) 
                reset([])                 
                setLoading(false)
            },
            onError: (errors) => {       
                setLoading(false)
                console.log('errors', errors)         
                toast.error(errors?.message || 'No message provided')
            },
            // only: ['status', 'redirect', 'user', 'test']
        })
        
    }

    const onVerifySubmit = (data) => {
                
        setLoading(true)
        router.post('/verify-otp', { email_address, otp: data.otp }, {
            onSuccess: () => {                      
                reset([])
                setValue('otp', data.otp)
                setLoading(false)
            },
            onError: (errors) => {       
                setLoading(false)
                setValue('otp', '')     
                
                toast.error(errors?.message || 'No message provided')
            },            
        })

    }

    const handlePaste = (e) => {
        e.preventDefault(); // stop default paste

        // Get raw clipboard text
        const pasted = e.clipboardData.getData("text");

        // Remove hyphen (or any non-digit characters if you want)
        const cleaned = pasted.replace(/[^0-9]/g, ""); // only digits

        // Now you need to manually set this into your OTP input
        // If SHInputOTP supports programmatic value setting:
        setValue('otp', cleaned);
    };

    const handleSetPassword = (data) => {
        setLoading(true)
        router.post('/reset-password', { email_address, otp: data.otp, ...data }, {
            onSuccess: () => {      
                reset([])                            
                setLoading(false)
                toast.success('Password reset successfully. Please login to continue.')
            },
            onError: (errors) => {       
                setLoading(false)
                setValue('otp', '')     
                
                toast.error(errors?.message || 'No message provided')
            },            
        })
    }
    
    console.log('Error', error)
    
    return(
        <AuthLayout>            
            <Head title="Forgot Password" />

            {
                (step === 1 || !step) &&
                <div>            
                    <h2 className="text-2xl mb-3 font-bold tracking-tight">Forgot Your Password?</h2>
                    <p className="text-foreground/50 mb-5">Enter your email address below and we'll help you reset your password to get back into PropFlow.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-5 flex flex-col space-y-5">   
                            <Input 
                                type="email" 
                                name="email_address"                        
                                size="lg"
                                startElement={<i className="ri-mail-line"/>} 
                                placeholder="Your email address..." 
                                {...register('email_address')}
                            />

                            <Button size="lg" loading={loading} className="rounded-lg" type="submit">Submit</Button>
                            
                            <TextLink  href="/">
                                <i className="ri-arrow-left-line"></i> Back to Login
                            </TextLink>
                        </div>
                    </form>
                </div>
            }
            {
                (step === 2) &&
                <div className="space-y-4">
                    {
                        (status) &&
                        <div className="px-3 py-2 rounded-md bg-green-700 text-white">{status}</div>
                    }

                    {
                        (error) &&
                        <div className="px-3 py-2 rounded-md bg-destructive text-white">{error}</div>
                    }
                    
                    <h2 className="text-2xl mb-3 font-bold tracking-tight">Enter OTP</h2>
                    <p className="text-foreground/50 mb-5">Enter the OTP sent to your email address</p>
                    <form onSubmit={handleSubmit(onVerifySubmit)}>
                        <InputOTP 
                            size="lg"
                            maxLength={6}
                            // type="number"
                            onComplete={handleSubmit(onVerifySubmit)}
                            onPaste={handlePaste}
                            value={watch('otp')}                            
                            onChange={(value) => setValue('otp', value)}
                            >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator className="text-xs text-muted-foreground" />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        <div className="mt-8">
                            <TextLink onClick={(e) => {e.preventDefault(); onSubmit({ email_address }) }} href="/">
                                <i className="ri-reset-left-line"></i> Resend OTP
                            </TextLink>
                        </div>
                    </form>
                </div>
            }
            {
                step === 3 &&
                <div className="space-y-4">
                    <div className="px-3 py-2 rounded-md bg-green-700 text-white">{status}</div>
                    <h2 className="text-2xl mb-3 font-bold tracking-tight">Password Reset</h2>
                    <p className="text-foreground/50 mb-5">You can now reset your password.</p>

                    <form onSubmit={handleSubmit(handleSetPassword)}>
                        <div className="space-y-4">
                            <Input.Password                    
                                // label="Password" 
                                name="password"
                                variant="lg"
                                startElement={<i className="ri-key-line"/>} 
                                placeholder="New Password" 
                                {...register('password')}
                            />

                            <Input.Password                    
                                // label="Confirm Password" 
                                name="password_confirmation"
                                variant="lg"
                                startElement={<i className="ri-key-line"/>} 
                                placeholder="Confirm New Password" 
                                {...register('password_confirmation')}
                            />

                            <Button size="lg" loading={loading} className="rounded-lg w-full" type="submit">Set New Password</Button>
                        </div>
                    </form>

                    <TextLink href="/">
                        <i className="ri-arrow-left-line"></i> Back to Login
                    </TextLink>
                </div>
            }


        </AuthLayout>
    )
}