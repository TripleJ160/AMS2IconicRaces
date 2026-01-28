/**
 * Era category type for race filtering
 */
export type EraCategory = 'All' | 'Formula 1' | 'Endurance' | 'Modern' | 'Historic' | 'Brazil';

/**
 * Mapping of era categories to their associated race tags
 */
export const CATEGORY_TAG_MAP: Record<EraCategory, string[]> = {
  'All': [], // Empty array means no filtering
  'Formula 1': ['F1'],
  'Endurance': ['Endurance', 'Group C', 'GT1', 'LMDh'],
  'Modern': ['Modern', 'GT3', 'V8'],
  'Historic': ['Historic', 'Vintage', 'Group A'],
  'Brazil': ['Brazil', 'Stock Car', 'Copa Truck']
};
