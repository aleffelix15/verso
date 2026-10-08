import { describe, expect, it } from 'vitest';
import { products, catalogCategories, catalogColors, provisionalImages } from '@/data/products';

describe('VERSO expanded catalog', () => {
  it('has 28 unique complete products in the six categories', () => {
    expect(products).toHaveLength(28);
    expect(new Set(products.map(p => p.slug)).size).toBe(28);
    expect(new Set(products.map(p => p.category)).size).toBe(6);
    products.forEach(p => {
      expect(catalogCategories).toContain(p.category);
      expect(p.price).toBeLessThanOrEqual(350);
      expect(p.images[0]).toBeTruthy();
      expect(p.sizes.length).toBeGreaterThan(0);
      expect(p.colors.length).toBeGreaterThan(0);
      expect(p.colors.length).toBeLessThanOrEqual(3);
      p.colors.forEach(c => expect(catalogColors).toContain(c));
      expect(p.verse && p.meaning && p.statement && p.fabric).toBeTruthy();
    });
  });
  it('preserves prices, badge counts and explicit fallback notices', () => {
    expect(products.find(p => p.slug === 'camiseta-paz')?.price).toBe(129);
    expect(products.filter(p => p.badge === 'NOVO')).toHaveLength(8);
    expect(products.filter(p => p.badge === 'MAIS VENDIDO')).toHaveLength(2);
    expect(products.filter(p => p.badge === 'ÚLTIMAS PEÇAS')).toHaveLength(2);
    expect(Object.keys(provisionalImages)).toEqual(['meias-passo','mochila-jornada']);
    products.slice(-5).forEach(p => expect(p.sizes).toEqual(['Único']));
  });
});