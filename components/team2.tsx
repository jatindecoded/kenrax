"use client"
import { BoxSelect, Circle, Italic, Search, SeparatorHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Product, toKebabCase } from "@/scripts/fetchNotionProducts";
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import ProductCard from "./productCard";
import properties from "../data/properties.json"


interface ProductPageInterface {
  products: Product[] | undefined;
  fallback: string;
}

const Team2 = ({ products, fallback = 'https://picsum.photos/id/237/400/900' }: ProductPageInterface) => {
  if (!products) {
    return null
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleToggle = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['partNumber', 'type', 'OEM', 'compatibleWith'],
      threshold: 0.4, // adjust for fuzziness (0 = exact, 1 = very fuzzy)
    });
  }, [products]);

  const results = searchQuery
    ? fuse
      .search(searchQuery)
      .map(result => result.item)
      .filter(product =>
        activeFilters.length === 0 ? true : activeFilters.includes(product.type.toLowerCase())
      )
    : products.filter(product =>
      activeFilters.length === 0 ? true : activeFilters.includes(product.type.toLowerCase())
    );

  const allTypes = new Set(products.map(p => p.type));

  const descMaxLength = 80;
  return (
    <section className="py-16 items-center">
      <div className="items-center flex flex-col items-start text-left">
        <h2 className="text-4xl font-bold tracking-tight text-pretty lg:text-4xl">
          Our Products
        </h2>
        <p className="mb-6 semibold text-md text-muted-foreground">We manufacture all of these.</p>
        <p className="semibold text-muted-foreground text-xs mb-1">Filter by Product Type:</p>
        <div className="flex gap-2 flex-wrap items-center mb-4">
          {
            Array.from(allTypes)?.map((p) => {
              return (
                <Toggle
                  variant={'outline'}
                  className="font-bold uppercase text-xs data-[state=on]:bg-primary data-[state=on]:text-background cursor-pointer"
                  aria-label="Toggle italic"
                  pressed={activeFilters.includes(p.toLowerCase())}
                  onPressedChange={() => handleToggle(p.toLowerCase())}
                >
                  {/* <Circle fontSize={8} /> */}
                  {p.toUpperCase()}
                </Toggle>

              )
            })
          }


        </div>
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a product. (Eg. B006700770010)"
            className="pl-8 placeholder:italic text-xs!" />

        </div>
      </div>
      <div className="items-center mt-16 grid gap-x-12 gap-y-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results?.map((product: Product) => {
          return (
            <ProductCard product={product} fallback={properties["media.homepage.photo.1"].media[0]} descMaxLength={descMaxLength} />
          )
        }
        )}
      </div >
    </section >
  );
};

export { Team2 };

