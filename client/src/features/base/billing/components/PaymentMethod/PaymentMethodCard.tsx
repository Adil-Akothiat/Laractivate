import { useEffect } from "react";
import { api } from "@/app/services/api";

export default function PaymentMethodCard() {
    // test
    useEffect(()=>{
        (async ()=> {
            const res = await api.get('/billing/payment-method');
            console.log(res);
        })()
        
    },[])

    
    return (
        <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <p className="text-gray-600">Manage your payment methods here.</p>
        </div>
    );
}