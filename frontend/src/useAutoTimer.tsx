import React, { useEffect, useState } from "react";

const useAutoTimer = (startTime: number) => {
    const [timer, setTimer] = useState(startTime);
    useEffect(() => {
        const myInterval = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : t));
        }, 1000);
        const resetTimeout = () => {
            setTimer(startTime);
        };
        const events = [
            "load",
            // "mousemove",
            "mousedown",
            "click",
            // "scroll",
            "keypress"
        ];
        for (let i in events) {
            window.addEventListener(events[i], resetTimeout);
        }
        return () => {
            clearInterval(myInterval);
            for (let i in events) {
                window.removeEventListener(events[i], resetTimeout);
            }
        };
    }, [startTime]);
    return timer;
};

export default useAutoTimer;
