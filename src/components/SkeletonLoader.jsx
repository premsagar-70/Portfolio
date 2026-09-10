import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden w-full px-6 md:px-12 animate-pulse">
      {/* 1. Navbar Skeleton */}
      <nav className="fixed top-0 left-0 w-full py-5 z-50">
        <div className="mx-auto max-w-5xl px-6 rounded-2xl border border-transparent bg-transparent flex justify-between items-center h-14">
          {/* Logo outline */}
          <div className="w-12 h-6 bg-bd/30 rounded-lg" />
          {/* Nav links outline */}
          <div className="hidden md:flex gap-6 items-center">
            <div className="w-16 h-5 bg-bd/20 rounded-md" />
            <div className="w-16 h-5 bg-bd/20 rounded-md" />
            <div className="w-16 h-5 bg-bd/20 rounded-md" />
            <div className="w-16 h-5 bg-bd/20 rounded-md" />
            <div className="w-20 h-8 bg-bd/30 rounded-lg ml-4" />
          </div>
          {/* Mobile menu button outline */}
          <div className="md:hidden w-8 h-8 bg-bd/20 rounded-lg" />
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl pt-24 space-y-24">
        {/* 2. Hero Section Skeleton */}
        <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-16 py-12">
          {/* Hero text outline */}
          <div className="flex-1 space-y-6 w-full text-center md:text-left">
            <div className="w-48 h-4 bg-bd/30 rounded-md tracking-wider mx-auto md:mx-0" />
            <div className="space-y-3">
              <div className="w-full max-w-lg h-12 bg-bd/40 rounded-xl mx-auto md:mx-0" />
              <div className="w-3/4 h-12 bg-bd/40 rounded-xl mx-auto md:mx-0" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto md:mx-0">
              <div className="w-full h-4 bg-bd/20 rounded-md" />
              <div className="w-5/6 h-4 bg-bd/20 rounded-md mx-auto md:mx-0" />
              <div className="w-4/5 h-4 bg-bd/20 rounded-md mx-auto md:mx-0" />
            </div>
            <div className="flex gap-4 justify-center md:justify-start pt-4">
              <div className="w-36 h-12 bg-bd/35 rounded-xl" />
              <div className="w-36 h-12 bg-bd/20 rounded-xl" />
            </div>
          </div>

          {/* Hero image outline */}
          <div className="flex-1 hidden md:flex justify-center items-center">
            <div className="relative">
              {/* Outer decorative ring outlines */}
              <div className="absolute -inset-4 rounded-full border border-bd/10 w-[20rem] h-[20rem]" />
              <div className="absolute -inset-8 rounded-full border border-bd/5 w-[22rem] h-[22rem]" />
              {/* Image circle */}
              <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-bd/25 border-2 border-bd/30 relative z-10" />
            </div>
          </div>
        </section>

        {/* 3. About Section Skeleton */}
        <section className="py-12 space-y-6 max-w-3xl mx-auto text-center">
          <div className="w-24 h-4 bg-bd/30 rounded-md mx-auto" />
          <div className="w-3/4 max-w-md h-8 bg-bd/40 rounded-xl mx-auto" />
          <div className="space-y-3 pt-4">
            <div className="w-full h-4 bg-bd/20 rounded-md" />
            <div className="w-11/12 h-4 bg-bd/20 rounded-md mx-auto" />
            <div className="w-10/12 h-4 bg-bd/20 rounded-md mx-auto" />
          </div>
        </section>

        {/* 4. Projects Section Skeleton */}
        <section className="py-12 space-y-12">
          <div className="space-y-3 text-center">
            <div className="w-24 h-4 bg-bd/30 rounded-md mx-auto" />
            <div className="w-48 h-8 bg-bd/40 rounded-xl mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Project Card 1 */}
            <div className="bg-surface/50 border border-bd/20 rounded-2xl p-3 space-y-5">
              <div className="w-full h-52 bg-bd/20 rounded-xl" />
              <div className="p-3 space-y-4">
                <div className="w-2/3 h-6 bg-bd/35 rounded-lg" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-bd/15 rounded-md" />
                  <div className="w-5/6 h-4 bg-bd/15 rounded-md" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-surface/50 border border-bd/20 rounded-2xl p-3 space-y-5">
              <div className="w-full h-52 bg-bd/20 rounded-xl" />
              <div className="p-3 space-y-4">
                <div className="w-1/2 h-6 bg-bd/35 rounded-lg" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-bd/15 rounded-md" />
                  <div className="w-5/6 h-4 bg-bd/15 rounded-md" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                  <div className="w-16 h-6 bg-bd/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkeletonLoader;
