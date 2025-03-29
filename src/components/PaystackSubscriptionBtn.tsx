"use client";
import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast';

const PaystackSubcriptionButton = ({isPro} :{isPro: boolean}) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubscription = async () => {
        try {
            if (!isPro){
                setIsLoading(true);
                const res = await axios.post('/api/paystack') as {data:{paymentLink: string, reference: string}};
    
                window.location.href = res.data.paymentLink;
            }
            return toast.success('You are a Pro User');
           
            
        } catch (error) {
            console.error(error);
            return toast.error('An error occurred');
            
        }finally{setIsLoading(false)}
    }

  return (
    <Button disabled={isLoading} onClick={handleSubscription} variant='destructive'>
        {isPro ? 'Manage Subscriptions' : 'Get Pro'}
    </Button>
  )
}

export default PaystackSubcriptionButton;