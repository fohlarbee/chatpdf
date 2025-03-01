"use client";
import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'

const SubcriptionButton = ({isPro} :{isPro: boolean}) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubscription = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/stripe');
            window.location.href = res.data.url;
        } catch (error) {
            console.log('error', error);
            
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <Button disabled={isLoading} onClick={handleSubscription} variant='destructive'>
        {isPro ? 'Manage Subscriptions' : 'Get Pro'}
    </Button>
  )
}

export default SubcriptionButton