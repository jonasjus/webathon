"use client";

import Link from "next/link";
import { useState } from "react";
import { CreateActivityForm } from "./create-activity-form";

interface CreateActivityCtaProps {
  isLoggedIn: boolean;
  buttonClassName: string;
  label?: string;
}

export function CreateActivityCta({
  isLoggedIn,
  buttonClassName,
  label = "Opprett aktivitet",
}: CreateActivityCtaProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <Link href="/login" className={buttonClassName}>
        {label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
      >
        {label}
      </button>

      {isOpen && <CreateActivityForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}
