import React from 'react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {settings.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
          {settings.heroSubtitle}
        </p>
      </div>
    </div>
  );
}