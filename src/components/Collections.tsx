import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/data";

interface CollectionSectionProps {
  title: string;
  description: string;
  type: "model" | "print";
}

function CollectionSection({ title, description, type }: CollectionSectionProps) {
  const items = collections.filter((c) => c.type === type);

  return (
    <section className="bg-dark py-12">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">{description}</p>
          </div>
          <Link
            href="/collections"
            className="shrink-0 text-sm font-semibold text-brand hover:text-brand-300"
          >
            View all collections
          </Link>
        </div>

        <div className="mt-8 flex gap-5 overflow-x-auto hide-scrollbar pb-2">
          {items.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group w-72 shrink-0 overflow-hidden rounded-xl bg-dark-50 transition hover:bg-dark-100 sm:w-80"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="320px"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white group-hover:text-brand">
                  {collection.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Collections() {
  return (
    <>
      <CollectionSection
        title="Discover Curated 3D Model Collections"
        description="Explore curated collections of CG models hand-picked for fast discovery and better landing pages."
        type="model"
      />
      <CollectionSection
        title="Discover Curated 3D Print Collections"
        description="Targeted collections of 3D print-ready models to support campaigns and seasonal promos."
        type="print"
      />
    </>
  );
}
