import React, { useEffect, useState } from "react";

const CursorGlow = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show on non-touch devices
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const onMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
            if (!visible) setVisible(true);
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);

        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
        };
    }, [visible]);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
            style={{
                opacity: visible ? 1 : 0,
                background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgb(var(--color-accent) / 0.08), transparent 60%)`
            }}
        />
    );
};

export default CursorGlow;
