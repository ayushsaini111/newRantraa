"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import useCheckoutStore from "@/store/checkoutStore";

export default function PricingCard({pooja}){

const router=useRouter();

const setPooja=useCheckoutStore(
state=>state.setPooja
);

return(

<div>

<h2>₹{pooja.offerPrice}</h2>

<p className="line-through">

₹{pooja.price}

</p>

<Button

onClick={()=>{

setPooja(pooja);

router.push("/checkout");

}}

>

Book Now

</Button>

</div>

)

}