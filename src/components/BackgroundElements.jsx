import React from 'react';

const BackgroundElements = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
            {/* Ambient Background Gradient Base */}
            <div className="absolute inset-0 bg-background transition-colors duration-700" />
            
            {/* Grid Pattern Lines Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                 style={{
                     backgroundImage: `
                         linear-gradient(to right, rgb(var(--color-tx-muted)) 1px, transparent 1px),
                         linear-gradient(to bottom, rgb(var(--color-tx-muted)) 1px, transparent 1px)
                     `,
                     backgroundSize: '64px 64px'
                 }}
            />

            {/* Subtle light/dark radial gradient mesh for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/[0.04] via-transparent to-transparent dark:from-accent/[0.06]" />

            {/* Floating Glow Sphere 1 */}
            <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] min-w-[350px] min-h-[350px] rounded-full bg-accent/[0.05] dark:bg-accent/[0.08] blur-[100px] md:blur-[130px] animate-pulse" 
                 style={{ animationDuration: '12s' }} />

            {/* Floating Glow Sphere 2 */}
            <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full bg-secondary/[0.03] dark:bg-secondary/[0.06] blur-[100px] md:blur-[120px] animate-pulse" 
                 style={{ animationDuration: '16s', animationDelay: '2s' }} />

            {/* Floating Glow Sphere 3 */}
            <div className="absolute top-[40%] left-[20%] w-[35vw] h-[35vw] min-w-[280px] min-h-[280px] rounded-full bg-blue-500/[0.02] dark:bg-indigo-500/[0.04] blur-[90px] md:blur-[110px] animate-pulse" 
                 style={{ animationDuration: '20s', animationDelay: '4s' }} />
        </div>
    );
};

export default BackgroundElements;
