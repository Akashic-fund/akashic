'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </button>
  );
}
