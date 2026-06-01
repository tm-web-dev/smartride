"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-linear-to-b from-primary/10 to-background">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Smart Bus Card Portal 🚍
        </h1>

        <p className="mt-4 max-w-xl text-muted-foreground text-lg">
          Apply for your Smart Bus Card and get <span className="font-semibold text-primary">30% discount</span> on all bus travels.
        </p>

        <div className="mt-6 flex gap-4">
          <Link href="/sign-up">
            <Button size="lg">Apply Now</Button>
          </Link>

          <Link href="/sign-in">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16 max-w-6xl mx-auto">
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-semibold">Easy Application</h3>
          <p className="text-muted-foreground mt-2">
            Fill your details and submit application in minutes.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-semibold">Track Status</h3>
          <p className="text-muted-foreground mt-2">
            Check your application status anytime from dashboard.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h3 className="text-xl font-semibold">Fast Delivery</h3>
          <p className="text-muted-foreground mt-2">
            Get your smart card delivered quickly after approval.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/50 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold">How it Works</h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <Step number="1" title="Sign Up" />
            <Step number="2" title="Fill Application" />
            <Step number="3" title="Make Payment" />
            <Step number="4" title="Get Card" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold">
          Start Your Journey Today 🚀
        </h2>

        <p className="mt-2 text-muted-foreground">
          Apply now and save on every ride.
        </p>

        <Link href="/sign-up">
          <Button size="lg" className="mt-6">
            Apply for Smart Card
          </Button>
        </Link>
      </section>
    </div>
  );
}

/* STEP COMPONENT */
function Step({ number, title }: { number: string; title: string }) {
  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm">
      <div className="text-2xl font-bold text-primary">{number}</div>
      <p className="mt-2 font-medium">{title}</p>
    </div>
  );
}