import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react'
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth.layout';
import { Icon } from "@/components/ui/icon";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';
import { Checkbox } from '@/components/ui/checkbox';
import { TextLink } from '@/components/ui/text-link';

const  Login = ({ status, redirect }) => {
    
    const [ loading, setLoading ] = useState(false)
    const { handleSubmit, register, watch, setValue, reset } = useForm()    
    
    
    useEffect(() => {
        if(status === 'authenticated') {   
            setTimeout(() => {
                window.location.href=redirect          
            }, 300)                                       
        }
    }, [status, redirect])

    const onSubmit = (data) => {
        setLoading(true)
        router.post('/auth', data, {
            onSuccess: () => {      
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
    
    return(
        <>
            <Head title="Login" />
            <h2 className="text-2xl mb-1 font-bold tracking-tight">Log in to your account</h2>
            <p className="text-foreground/50 mb-5">Good to see you again! Log in to get started.</p>

            {
                status === 'authenticated' &&
                <div className="bg-green-200 dark:bg-green-600 px-3 py-2 text-sm text-green-600 dark:text-green-100">
                    Login successful! You will be redirected shortly.
                </div>
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-5 flex flex-col space-y-5">   

                
                    <Input 
                        type="email" 
                        name="email_address"
                        label="Email Address" 
                        size="lg"
                        startElement={<Icon name="mail-line"/>} 
                        placeholder="e.g. john@email.com" 
                        {...register('email_address')}
                    />
                    <Input.Password                    
                        label="Password" 
                        name="password"
                        size="lg"
                        startElement={<Icon name="key-line"/>} 
                        placeholder="" 
                        {...register('password')}
                    />
                    <div className="flex flex-row items-center justify-between">
                        <Checkbox checked={watch('remember')} onCheckedChange={(e) => setValue('remember',e)}>Remember Me </Checkbox>
                        <TextLink  className="text-base hover:underline hover:text-blue-400" href="/forgot-password">Forgot Password?</TextLink>
                    </div>
                    <Button size="lg" className="rounded-lg" loading={loading} type="submit">Login</Button>
                </div>
            </form>                         
        </>
    )
}

Login.layout = (page) => <AuthLayout children={page} />;

export default Login