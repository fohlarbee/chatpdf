import axios from "axios";

interface PaystackMetadata {
    email: string;
    amount: number;
    metadata: Record<string, string>;
}
interface PaystackError extends Error {
    response: {
        data: {
            message: string;
        };
    };
}


export async function createPaymentLink(PaystackMetadata: PaystackMetadata) {
    const {amount, email, metadata} = PaystackMetadata;

    try {
        const res = await axios.post('https://api.paystack.co/transaction/initialize', {
            reference: `SUB_${Date.now()}`,
            amount: amount * 100,
            currency: 'NGN',
            metadata,
            email,
            callback_url:`${process.env.PAYMENT_REDIRECT_URL as string}`,
             },
             { headers: { Authorization: `Bearer ${process.env.PSK_SECRET_KEY}` }
    
        });
    
        const { authorization_url: paymentLink, reference } = res.data.data;
        return { paymentLink, reference };
    } catch (error) {
        const paystackError = error as PaystackError;
        if (paystackError.response){
            console.error(paystackError.response);
            throw new Error(paystackError.response.data.message);
        }

        throw new Error ('Error creating payment link');
        
    }
   
}

export async function verifyPayment(reference: string) {
    try {
        const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PSK_SECRET_KEY}`
            }
        });
        return res.data.data;
    } catch (error) {
        const paystackError = error as PaystackError;
        if (paystackError.response){
            console.error(paystackError.response);
            throw new Error(paystackError.response.data.message);
        }
        console.error(error);
        throw new Error('Error verifying payment');
    }
}

