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
                toast.error(
                    errors?.message
                        || errors?.email_address
                        || errors?.password
                        || 'Login failed. Please try again.',
                )
            },
            // only: ['status', 'redirect', 'user', 'test']
        })

    }
    
    return(
        <>
            <Head title="Login" />
            <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
                Welcome back
            </h2>
            <p className="mb-5 text-muted-foreground">
                Sign in to manage your school&apos;s people, academics, and
                operations.
            </p>

            {
                status === 'authenticated' &&
                <div className="rounded-md bg-success-muted px-3 py-2 text-sm text-success-muted-foreground">
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
                        startElement={<Icon name="mail-line" />}
                        placeholder="e.g. john@email.com"
                        {...register('email_address')}
                    />
                    <Input.Password
                        label="Password"
                        name="password"
                        size="lg"
                        startElement={<Icon name="key-line" />}
                        placeholder=""
                        {...register('password')}
                    />
                    <div className="flex flex-row items-center justify-between">
                        <Checkbox
                            checked={watch('remember')}
                            onCheckedChange={(checked) =>
                                setValue('remember', checked)
                            }
                        >
                            Remember Me
                        </Checkbox>
                        <TextLink
                            className="text-base hover:text-primary"
                            href="/forgot-password"
                        >
                            Forgot Password?
                        </TextLink>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-lg"
                        loading={loading}
                        type="submit"
                    >
                        Login
                    </Button>
                </div>
            </form>                         
        </>
    )
}

Login.layout = (page) => <AuthLayout children={page} />;

export default Login