import React from 'react';

const BackgroundElements = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Top left blob */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/30 dark:bg-blue-900/40 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />

            {/* Bottom right blob */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/30 dark:bg-purple-900/40 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

            {/* Middle blob */}
            <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/30 dark:bg-pink-900/40 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
    );
};

export default BackgroundElements;
