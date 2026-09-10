export type JuiceCategory = "Cleanse" | "Immunity" | "Energy" | "Detox";

export interface NutrientItem {
  id: string;
  name: string;
  amountBottle: string;
  amount100ml: string;
  dvPercent: number | null; // null for no official DV (like sugar or trans fat)
  indent?: boolean;
  bold?: boolean;
  source: string;
  mechanism: string;
}

export interface BioactiveCompound {
  name: string;
  amount: string;
  targetOrgan: string;
  mechanism: string;
}

export interface DetailedNutrition {
  servingSizeBottle: string; // "1 Bottle (350 mL / 11.8 fl oz)"
  servingSize100ml: string; // "100 mL (3.4 fl oz)"
  servingsPerContainer: number;
  caloriesBottle: number;
  calories100ml: number;
  nutrients: NutrientItem[];
  bioactives: BioactiveCompound[];
}

export interface JuiceItem {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  category: JuiceCategory;
  description: string;
  tastingNotes: string[];
  ingredients: {
    name: string;
    origin: string;
    role: string;
  }[];
  nutrition: DetailedNutrition;
  colors: {
    primary: string; // liquid hex
    accent: string;  // vibrant neon glow
    glow: string;    // ambient glow rgba/hex
    contrast: string;// text on accent
  };
  stats: {
    coldPressPsi: string;
    temperature: string;
    enzymePurity: string;
    phLevel: string;
  };
  benefits: string[];
}
