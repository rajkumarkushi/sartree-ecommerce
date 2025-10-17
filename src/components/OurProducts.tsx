import React, { useEffect, useState } from 'react';
import { CardSelection } from './CardSelection';
import axios from 'axios';

const products = [
  // {
  //   id: '1',
  //   image: '/images/b9-bio-rice-green.png',
  //   title: 'Bio Rice Green',
  //   description: 'Organic green rice product'
  // },
  // {
  //   id: '2',
  //   image: '/images/b9-bio-rice-red.png',
  //   title: 'Bio Rice Red',
  //   description: 'Organic red rice product'
  // },
  // {
  //   id: '3',
  //   image: '/images/WhatsApp Image 2025-01-23 at 10.52.19 AM.jpeg',
  //   title: 'Premium Rice',
  //   description: 'High-quality premium rice selection'
  // },
  // {
  //   id: '4',
  //   image: '/images/WhatsApp Image 2025-01-23 at 10.51.01 AM.jpeg',
  //   title: 'Special Rice',
  //   description: 'Special grade rice variety'
  // }
];

export const OurProducts = () => {
  const handleProductSelect = (productId: string) => {
    console.log('Selected product:', productId);
    // Add your product selection logic here
  };
  
  

  return (
    <section className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our selection of premium quality rice products. Each variety is carefully selected and processed to ensure the highest quality.
        </p>
      </div>
      
      <CardSelection
        cards={products}
        onSelect={handleProductSelect}
        className="max-w-7xl mx-auto"
      />
    </section>
  );
}; 