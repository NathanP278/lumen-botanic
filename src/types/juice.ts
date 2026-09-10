export type JuiceCategory = "All" | "Cleanse" | "Detox" | "Energy" | "Immunity";

export interface NutritionFact {
  calories: number;
  sugar: string;
  protein: string;
  potassium: string;
  vitaminC: string;
}

export interface JuiceItem {
  id: string;
  name: string;
  subtitle: string;
  category: "Cleanse" | "Detox" | "Energy" | "Immunity";
  description: string;
  notes: string[];
  ingredients: string[];
  nutrition: NutritionFact;
  price: number;
  color: string;
  accentColor: string;
  image: string;
  tag: string;
  benefits: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isPack?: boolean;
  packItems?: string[];
}
