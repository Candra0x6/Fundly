"use client";

import { useRef } from "react";
import {
  BarChart3,
  Bitcoin,
  BuildingIcon,
  CircleIcon,

  CoinsIcon,
  GlobeIcon,
  Ham,
  HandCoinsIcon,
  HeartIcon,
  LandmarkIcon,
  Salad,
  Shield,

  Shirt,

  Store,

  TvMinimal,

  Users,
  UserSearch,
  UsersIcon,
  WalletIcon,
  Zap,
} from "lucide-react";
import { AnimatedBeam } from "./animated-beam";
import { Button } from "../ui/button";
import StatCard from "../stat-card";

export default function MSMEIntegrationFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Main nodes
  const connectNodeRef = useRef<HTMLDivElement>(null);
  const syncNodeRef = useRef<HTMLDivElement>(null);
  const databaseRef = useRef<HTMLDivElement>(null);

  // Left side service nodes
  const service1Ref = useRef<HTMLDivElement>(null);
  const service2Ref = useRef<HTMLDivElement>(null);
  const service3Ref = useRef<HTMLDivElement>(null);
  const service4Ref = useRef<HTMLDivElement>(null);

  // Right side service nodes
  const service5Ref = useRef<HTMLDivElement>(null);
  const service6Ref = useRef<HTMLDivElement>(null);
  const service7Ref = useRef<HTMLDivElement>(null);
  const service8Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-screen w-full items-center justify-center overflow-hidden  "
      ref={containerRef}
    >
      <div className="absolute z-0 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Connect Node */}
      <div
        ref={connectNodeRef}
        className="absolute left-[25%] top-1/2 -translate-y-1/2 flex items-center justify-center z-10 mt-11"
      >
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="mt-2 font-medium">MSME</span>
        </div>
      </div>

      {/* Sync Node */}
      <div
        ref={syncNodeRef}
        className="absolute right-[25%] top-1/2 -translate-y-1/2 flex items-center justify-center z-10 mt-8"
      >
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <UserSearch className="h-5 w-5" />
          </div>
          <span className="mt-2 font-medium">Investor</span>
        </div>
      </div>

      {/* Central UI Component */}
      <section ref={databaseRef} className="z-20 backdrop-blur-sm bg-white/10 lg:bg-transparent lg:backdrop-blur-none">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Connecting <span className="text-emerald-500">MSMEs</span> with{" "}
              <span className="text-emerald-500">Investors</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
              A revolutionary platform that enables MSMEs to tokenize their revenue streams and connect with investors
              looking for new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" className="h-12 px-6 rounded-xl font-bold">
                Start Investing
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <StatCard
                value="$12.5M+"
                label="Invested"
                icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
              />
              <StatCard value="450+" label="Verified MSMEs" icon={<Shield className="h-5 w-5 text-emerald-500" />} />
              <StatCard value="2,800+" label="Active Investors" icon={<Users className="h-5 w-5 text-emerald-500" />} />
              <StatCard value="1,200+" label="NFTs Created" icon={<Zap className="h-5 w-5 text-emerald-500" />} />
            </div>
          </div>
        </div>
      </section>


      {/* Left side service nodes */}
      <div
        ref={service1Ref}
        className="absolute left-[5%] top-[20%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md "
      >
        <Ham className="h-5 w-5 text-blue-500" />
      </div>

      <div
        ref={service2Ref}
        className="absolute left-[10%] top-[40%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <Salad className="h-5 w-5 text-indigo-500" />
      </div>

      <div
        ref={service3Ref}
        className="absolute left-[5%] top-[60%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <TvMinimal className="h-5 w-5 text-emerald-500" />
      </div>

      <div
        ref={service4Ref}
        className="absolute left-[10%] top-[80%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <Shirt className="h-5 w-5 text-amber-500" />
      </div>

      {/* Right side service nodes */}
      <div
        ref={service5Ref}
        className="absolute right-[5%] top-[20%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <LandmarkIcon className="h-5 w-5 text-blue-500" />
      </div>

      <div
        ref={service6Ref}
        className="absolute right-[10%] top-[40%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <BuildingIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div
        ref={service7Ref}
        className="absolute right-[5%] top-[60%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <HandCoinsIcon className="h-5 w-5 text-orange-500" />
      </div>

      <div
        ref={service8Ref}
        className="absolute right-[10%] top-[80%] flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md z-10"
      >
        <CoinsIcon className="h-5 w-5 text-cyan-500" />
      </div>

      {/* Connection lines - Left services to Connect node */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service1Ref}
        toRef={connectNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service2Ref}
        toRef={connectNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service3Ref}
        toRef={connectNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service4Ref}
        toRef={connectNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />

      {/* Connection lines - Right services to Sync node */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service5Ref}
        toRef={syncNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service6Ref}
        toRef={syncNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service7Ref}
        toRef={syncNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={service8Ref}
        toRef={syncNodeRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
      />

      {/* Connection lines - Main nodes to central component */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={connectNodeRef}
        toRef={databaseRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="#4f46e5"
        gradientStopColor="transparent"
        curvature={50}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={syncNodeRef}
        toRef={databaseRef}
        pathColor="#e5e7eb"
        pathWidth={1}
        pathOpacity={0.8}
        gradientStartColor="#4f46e5"
        gradientStopColor="transparent"
        curvature={-50}
      />
    </div>
  );
}
