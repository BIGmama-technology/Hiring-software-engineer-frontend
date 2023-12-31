"use client"

import {useState} from "react";
import {Button} from "@/primitives/Button";
import {toast} from "sonner";

function ShareSVG(){
    return <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="share-alt" className="icon glyph fill-white stroke-white group-hover:fill-black group-hover:stroke-black"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M20,21H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8A1,1,0,0,1,8,6H4V19H20V13a1,1,0,0,1,2,0v6A2,2,0,0,1,20,21Z" /><path d="M21.62,6.22l-5-4a1,1,0,0,0-1.05-.12A1,1,0,0,0,15,3V4.19a9.79,9.79,0,0,0-7,7.65,1,1,0,0,0,.62,1.09A1,1,0,0,0,9,13a1,1,0,0,0,.83-.45C11,10.78,13.58,10.24,15,10.07V11a1,1,0,0,0,.57.9,1,1,0,0,0,1.05-.12l5-4a1,1,0,0,0,0-1.56Z" /></g></svg>
}

function SuccessSVG(){
    return <svg width="20px" height="20px" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg fill-white stroke-white group-hover:fill-black group-hover:stroke-black"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M4.63 15.638a1.028 1.028 0 0 1-.79-.37L.36 11.09a1.03 1.03 0 1 1 1.58-1.316l2.535 3.043L9.958 3.32a1.029 1.029 0 0 1 1.783 1.03L5.52 15.122a1.03 1.03 0 0 1-.803.511.89.89 0 0 1-.088.004z" /></g></svg>
}

export default function ShareIcon({ textToCopy }: { textToCopy: string }){

    const [display,setDisplay ] = useState(<ShareSVG />);

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setDisplay(<SuccessSVG />);
            toast("Copied to clipboard", {
                description: "Share the room id with a friend to give them access",
            })

            // Revert the button text to "Share" after 2000 milliseconds (2 seconds)
            setTimeout(() => {
                setDisplay(<ShareSVG />);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text to clipboard:", error);
        }
    };

    return (
        <Button className={"border-none bg-black group"} variant="subtle"  onClick={handleClick}>{display}</Button>
    )
}