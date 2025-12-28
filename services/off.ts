
import { Product } from '../types';

export const fetchProductData = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status !== 1) return null;
    
    const p = data.product;
    
    // Cleanup names and brands
    const cleanBrand = p.brands ? p.brands.split(',')[0].trim() : 'Unknown Brand';
    const cleanName = p.product_name || p.product_name_en || 'Unknown Product';

    return {
      barcode,
      name: cleanName,
      brand: cleanBrand,
      image: p.image_front_url || 'https://picsum.photos/400/400?random=' + barcode,
      ingredients: p.ingredients_text ? p.ingredients_text.split(',').map((i: string) => i.trim()) : [],
      healthGrade: (p.nutriscore_grade || 'c').toUpperCase(),
      ecoGrade: (p.ecoscore_grade || 'c').toUpperCase(),
      nutriments: p.nutriments || {},
      lastScannedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
};
