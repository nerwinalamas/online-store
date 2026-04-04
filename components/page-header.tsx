"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        {backHref ? (
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h1 className="text-base font-bold">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
