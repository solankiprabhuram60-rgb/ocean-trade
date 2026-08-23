import Link from "next/link";
import Image from "next/image";

const benefits = [
  "Includes 840K+ models",
  "Royalty-free, no AI license",
  "New models added daily",
];

export default function SubscriptionBanner() {
  return (
    <section className="bg-dark py-10">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E8F4FD] via-[#F0F8FF] to-[#E0F0FA]">
          <div className="grid grid-cols-1 items-center gap-6 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
                Get up to 25 premium 3D models every month for the price of one
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {benefit}
                  </span>
                ))}
              </div>

              <Link
                href="/subscribe"
                className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                Unlock 25 premium downloads
              </Link>

              <p className="mt-3 text-xs text-gray-500">
                Limited time offer · Save 60% on your subscription
              </p>
            </div>

            <div className="relative hidden h-64 lg:block">
              <div className="absolute right-8 top-0 rounded-2xl bg-white px-5 py-4 shadow-lg">
                <p className="text-sm text-gray-600">
                  Get up to <strong className="text-gray-900">$250+</strong> in value
                </p>
                <p className="mt-1 text-2xl font-bold text-brand">
                  for $9.99/mo
                </p>
              </div>
              <div className="absolute bottom-0 right-16 rounded-xl bg-white/90 px-3 py-2 text-xs text-gray-600 shadow">
                For your everyday needs
              </div>
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop"
                alt="3D model preview"
                width={280}
                height={280}
                className="absolute bottom-0 right-0 rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
