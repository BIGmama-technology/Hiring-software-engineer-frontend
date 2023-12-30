"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ShareButton() {
    const searchParams = useSearchParams();
    const [buttonText, setButtonText] = useState("Share");

    const room = searchParams.get("room") || "";

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(room);
            console.log("Text copied to clipboard:", room);
            setButtonText("Copied");

            // Revert the button text to "Share" after 2000 milliseconds (2 seconds)
            setTimeout(() => {
                setButtonText("Share");
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text to clipboard:", error);
        }
    };

    return (
        <div onClick={handleClick} className={"button block pl-4"}>
            {buttonText}
        </div>
    );
}
