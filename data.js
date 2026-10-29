// ============================================================================
// NUTRITRUTH - PRODUCT & NUTRITION DATABASE
// Inspired by TruthIn App & Revant Himatsingka (@foodpharmer)
// "Label Padhega India" Movement - Truth Behind Packaged Food
// ============================================================================

const PRODUCTS_DATA = [
  {
    id: "bournvita",
    name: "Bournvita Cadbury Chocolate Drink",
    brand: "Mondelez Cadbury",
    category: "beverages",
    isVeg: true,
    novaClass: 4, // Ultra-processed
    allergens: ["Gluten (Barley)", "Milk Solids", "Soy Lecithin"],
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    truthScore: 28,
    status: "avoid", // "clean", "moderate", "avoid"
    ratingLabel: "Ultra-Processed / High Sugar",
    sugarGramsPer100g: 49.8,
    sugarCubesPerServing: 5.5,
    servingSize: "20g (2 spoons)",
    palmOil: false,
    palmOilDetails: "No palm oil, but uses liquid glucose & invert sugar syrup.",
    matchRatings: {
      general: { score: 28, status: "avoid", note: "Nearly 50% sugar by weight. Maltodextrin and liquid glucose spike insulin." },
      diabetes: { score: 12, status: "avoid", note: "CRITICAL: Extreme glycemic load. Liquid glucose + maltodextrin cause rapid blood glucose surges." },
      kids: { score: 20, status: "avoid", note: "Revant Himatsingka viral campaign exposed Bournvita's high sugar for growing children." },
      fitness: { score: 25, status: "avoid", note: "Low protein (7g) vs extremely high empty carbs (85g)." },
      weight: { score: 18, status: "avoid", note: "High calorie density (395 kcal) from fast-absorbing simple sugars." }
    },
    frontClaims: [
      { claim: "Tayaari Jeet Ki! (Prepares you to win)", verdict: "Misleading", explanation: "Marketed as a health drink for champions, but is virtually 50% sugar by weight." },
      { claim: "Contains Vitamin D, Iron, Calcium for Immunity", verdict: "Marketing Gimmick", explanation: "Synthetic vitamins are added to justify calling a sugar powder a 'health supplement'." }
    ],
    realityCheck: "Bournvita is nearly 50% sugar by weight. Its top ingredients are Sugar, Cereal Extract, Maltodextrin, and Liquid Glucose. Revant Himatsingka's viral video forced Cadbury to reduce added sugars by ~15%, but it remains predominantly a sugary malt beverage.",
    ingredientsList: "Cereal Extract (56%), Sugar, Cocoa Solids, Caramel Colour (INS 150c), Liquid Glucose, Maltodextrin, Protein Micronutrients, Emulsifiers (INS 322, INS 471), Raising Agent (INS 500(ii)), Artificial Chocolate & Vanilla Flavours.",
    flaggedIngredients: [
      { name: "Sugar", reason: "Adds 49.8g of empty sugar per 100g", severity: "high" },
      { name: "Liquid Glucose", reason: "High-glycemic simple sugar that spikes insulin rapidly", severity: "high" },
      { name: "Maltodextrin", reason: "Glycemic index higher than table sugar (GI 110-130)", severity: "high" },
      { name: "INS 150c (Caramel Colour III)", reason: "Ammonia caramel synthesized under heat and pressure", severity: "medium" },
      { name: "Synthetic Flavours", reason: "Chemical aromatics masking lack of real cacao", severity: "low" }
    ],
    nutritionPer100g: {
      calories: 395,
      carbs: 85.2,
      totalSugars: 49.8,
      addedSugars: 32.2,
      protein: 7.0,
      fat: 1.8,
      saturatedFat: 1.1,
      sodium: 140
    },
    cleanAlternativeId: "clean-sattu",
    cleanAlternativeName: "Roasted Chana Sattu / Raw Cacao Milk",
    cleanAlternativeSavings: "-40g Sugar, Zero Maltodextrin, +18g Natural Protein"
  },
  {
    id: "maggi-noodles",
    name: "Maggi 2-Minute Masala Instant Noodles",
    brand: "Nestle",
    category: "instant-meals",
    isVeg: true,
    novaClass: 4,
    allergens: ["Wheat Gluten", "Hydrolysed Groundnut Protein"],
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    truthScore: 32,
    status: "avoid",
    ratingLabel: "High Sodium / Palm Oil Fried",
    sugarGramsPer100g: 2.2,
    sugarCubesPerServing: 0.5,
    servingSize: "70g (1 pack)",
    palmOil: true,
    palmOilDetails: "Noodle cake is flash-fried in Palmolein (palm oil).",
    matchRatings: {
      general: { score: 32, status: "avoid", note: "Deep-fried refined flour with half a day's sodium in a single pack." },
      diabetes: { score: 30, status: "avoid", note: "Refined maida strips fiber, creating high glycemic starch absorption." },
      kids: { score: 25, status: "avoid", note: "Cheap palmolein fat and extreme sodium (860mg) unsuited for growing organs." },
      fitness: { score: 35, status: "avoid", note: "Low quality protein; 15.7g cheap saturated fat from palm oil." },
      weight: { score: 28, status: "avoid", note: "Calorie dense (427 kcal/100g) with zero satiety value." }
    },
    frontClaims: [
      { claim: "Goodness of Iron / 15% Daily Iron", verdict: "Token Fortification", explanation: "Synthetic iron is sprayed on refined maida noodles deep-fried in cheap palm oil." },
      { claim: "2-Minute Meal", verdict: "Convenient but Ultra-Processed", explanation: "Pre-cooked flash-fried noodle cake with excessive sodium and flavor enhancers." }
    ],
    realityCheck: "The noodle cake is made of refined wheat flour (Maida) deep-fried in Palmolein (palm oil). A single pack contains over 850mg of sodium (nearly 50% of the entire WHO daily recommended salt limit), along with flavor enhancers like INS 635.",
    ingredientsList: "Noodles: Refined Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Mineral (Calcium Carbonate), Thickeners (INS 508, INS 412), Acidity Regulators (INS 501(i), INS 500(i)). Tastemaker: Hydrolysed Groundnut Protein, Mixed Spices (19.4%), Dehydrated Onion, Sugar, Toasted Garlic, Flavour Enhancer (INS 635), Palm Oil, Acidity Regulator (INS 330), Caramel Salt.",
    flaggedIngredients: [
      { name: "Palm Oil (Palmolein)", reason: "Cheap refined oil high in saturated fatty acids (palmitic acid)", severity: "high" },
      { name: "Refined Wheat Flour (Maida)", reason: "Stripped of bran and fiber, causing rapid blood glucose spikes", severity: "high" },
      { name: "INS 635 (Disodium 5'-ribonucleotides)", reason: "Synthetic flavor potentiator combined with high sodium", severity: "medium" },
      { name: "High Sodium (860mg/pack)", reason: "Consumes half of your entire daily recommended sodium limit", severity: "high" }
    ],
    nutritionPer100g: {
      calories: 427,
      carbs: 63.5,
      totalSugars: 2.2,
      addedSugars: 1.5,
      protein: 8.0,
      fat: 15.7,
      saturatedFat: 7.3,
      sodium: 1220
    },
    cleanAlternativeId: "slurrp-farm-millet-noodles",
    cleanAlternativeName: "Slurrp Farm Foxtail Millet Noodles (Sun-Dried)",
    cleanAlternativeSavings: "0 Palm Oil (Not Fried), 100% Millets, -60% Sodium"
  },
  {
    id: "oreo-biscuit",
    name: "Cadbury Oreo Original Vanilla Cream Cookies",
    brand: "Mondelez Cadbury",
    category: "biscuits",
    isVeg: true,
    novaClass: 4,
    allergens: ["Wheat Gluten", "Soy Lecithin"],
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60",
    truthScore: 24,
    status: "avoid",
    ratingLabel: "Palm Oil + 38% Sugar",
    sugarGramsPer100g: 38.5,
    sugarCubesPerServing: 3.0,
    servingSize: "30g (3 cookies)",
    palmOil: true,
    palmOilDetails: "Contains Palmolein and Fractionated Palm Oil in cookie and creme.",
    matchRatings: {
      general: { score: 24, status: "avoid", note: "38.5% sugar combined with palmolein creates a hyper-palatable dopamine trap." },
      diabetes: { score: 15, status: "avoid", note: "Massive sugar spike. Invert sugar syrup and maida absorb rapidly." },
      kids: { score: 18, status: "avoid", note: "Zero dairy cream in the filling; made of vegetable fat and powdered sugar." },
      fitness: { score: 20, status: "avoid", note: "Virtually zero protein or micronutrients; high in saturated palmitic acid." },
      weight: { score: 19, status: "avoid", note: "Nearly 500 kcal per 100g with extreme sugar density." }
    },
    frontClaims: [
      { claim: "Rich Cocoa Flavor & Real Vanilla Taste", verdict: "Artificial Flavours", explanation: "Uses artificial ethyl vanillin and synthetic flavoring agents; contains only ~3% cocoa powder." },
      { claim: "Twist, Lick, Dunk Fun!", verdict: "Designed for Cravings", explanation: "Hyper-palatable combination of 38% sugar and saturated palm fat triggers dopamine spikes." }
    ],
    realityCheck: "Over 38g of sugar per 100g, combined with refined maida and cheap palmolein. The white 'cream' contains zero dairy or milk solids—it is predominantly hydrogenated vegetable fat and powdered sugar with artificial vanillin flavour.",
    ingredientsList: "Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Palmolein, Cocoa Solids (3.3%), Invert Sugar, Leavening Agents (INS 500(ii), INS 503(ii)), Edible Salt, Emulsifier (INS 322), Artificial Flavouring Substances (Vanilla).",
    flaggedIngredients: [
      { name: "Palmolein & Fractionated Palm Oil", reason: "Cheap industrial fat high in saturated palmitic acid", severity: "high" },
      { name: "Sugar (38.5g/100g)", reason: "More than one-third of every bite is pure sugar", severity: "high" },
      { name: "Invert Sugar Syrup", reason: "Pre-hydrolyzed sucrose and fructose that absorbs instantly", severity: "high" },
      { name: "Refined Flour (Maida)", reason: "Devoid of dietary fiber", severity: "medium" }
    ],
    nutritionPer100g: {
      calories: 483,
      carbs: 71.2,
      totalSugars: 38.5,
      addedSugars: 37.0,
      protein: 5.2,
      fat: 19.5,
      saturatedFat: 9.8,
      sodium: 460
    },
    cleanAlternativeId: "the-whole-truth-biscuit",
    cleanAlternativeName: "The Whole Truth 100% Clean Date & Oat Cookies",
    cleanAlternativeSavings: "Zero Added Sugar (Sweetened with Dates), 0 Palm Oil (Butter/Ghee only)"
  },
  {
    id: "sting-energy-drink",
    name: "Sting Energy Drink (Strawberry Flavour)",
    brand: "PepsiCo",
    category: "beverages",
    isVeg: true,
    novaClass: 4,
    allergens: ["None declared"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
    truthScore: 18,
    status: "avoid",
    ratingLabel: "Liquid Sugar + Synthetic Red Dye",
    sugarGramsPer100g: 13.7,
    sugarCubesPerServing: 8.5,
    servingSize: "250ml can",
    palmOil: false,
    palmOilDetails: "No fat, but delivers 34g of concentrated liquid sugar.",
    matchRatings: {
      general: { score: 18, status: "avoid", note: "34g sugar per bottle + Red 40 synthetic dye + high synthetic caffeine." },
      diabetes: { score: 8, status: "avoid", note: "CRITICAL HAZARD: Liquid sugar causes instant extreme blood sugar surges." },
      kids: { score: 10, status: "avoid", note: "High caffeine and Allura Red dye (INS 129) linked to hyperactivity in children." },
      fitness: { score: 15, status: "avoid", note: "Fake energy followed by severe insulin crash." },
      weight: { score: 12, status: "avoid", note: "138 empty calories consumed in seconds with zero fullness." }
    },
    frontClaims: [
      { claim: "Electrifying Energy", verdict: "Sugar Crash Trap", explanation: "Energy comes strictly from 34 grams of fast-digesting sugar and 72mg of synthetic caffeine." },
      { claim: "With B-Vitamins (B3, B6, B12)", verdict: "Halo Effect", explanation: "Adding micro-cents of synthetic vitamins does not offset the metabolic harm of 34g liquid sugar." }
    ],
    realityCheck: "A single 250ml bottle priced at just Rs 20 delivers a shocking 34 grams of sugar—surpassing the WHO recommended daily added sugar intake for an entire day! Coloured with Red 40 (Allura Red INS 129), a synthetic dye linked to hyperactivity in children.",
    ingredientsList: "Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 331), Sequestrants (INS 452(i), INS 385), Taurine (0.2%), Caffeine (0.03%), Preservatives (INS 211, INS 202), Flavouring Substances, Inositol, Vitamin Premix, Colour (INS 129 - Allura Red).",
    flaggedIngredients: [
      { name: "Liquid Sugar (34g per bottle)", reason: "Exceeds the entire WHO daily limit of 25g added sugar in minutes", severity: "high" },
      { name: "INS 129 (Allura Red / Red 40)", reason: "Synthetic azo dye banned or requiring warning labels in the EU", severity: "high" },
      { name: "High Caffeine (72mg/bottle)", reason: "High stimulant dose especially dangerous for children & teens", severity: "high" },
      { name: "INS 211 (Sodium Benzoate)", reason: "Preservative that can form traces of benzene with Vitamin C", severity: "medium" }
    ],
    nutritionPer100g: {
      calories: 55,
      carbs: 13.7,
      totalSugars: 13.7,
      addedSugars: 13.7,
      protein: 0.1,
      fat: 0,
      saturatedFat: 0,
      sodium: 78
    },
    cleanAlternativeId: "tender-coconut",
    cleanAlternativeName: "Fresh Tender Coconut Water / Fresh Lime Soda",
    cleanAlternativeSavings: "-34g Added Sugar, 0 Synthetic Dyes, 100% Natural Electrolytes"
  },
  {
    id: "nutella-spread",
    name: "Nutella Hazelnut Spread with Cocoa",
    brand: "Ferrero",
    category: "spreads",
    isVeg: true,
    novaClass: 4,
    allergens: ["Hazelnuts (Tree Nuts)", "Milk Solids", "Soy Lecithin"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60",
    truthScore: 22,
    status: "avoid",
    ratingLabel: "56% Sugar + Palm Oil",
    sugarGramsPer100g: 56.3,
    sugarCubesPerServing: 4.2,
    servingSize: "30g (2 tablespoons)",
    palmOil: true,
    palmOilDetails: "The #2 ingredient is Palm Oil (~30% of the jar).",
    matchRatings: {
      general: { score: 22, status: "avoid", note: "Over 85% of every jar is pure granulated sugar and palm oil." },
      diabetes: { score: 10, status: "avoid", note: "56.3% sugar causes immediate blood sugar elevation." },
      kids: { score: 18, status: "avoid", note: "Marketed as a breakfast staple, but is nutritionally equivalent to dessert frosting." },
      fitness: { score: 22, status: "avoid", note: "Only 6.3g protein vs 56g sugar and 31g fat." },
      weight: { score: 15, status: "avoid", note: "539 kcal per 100g. Extremely high calorie density." }
    },
    frontClaims: [
      { claim: "Hazelnut Spread with Skimmed Milk & Cocoa", verdict: "Disguised Candy", explanation: "Hazelnuts make up only 13%. More than 85% of every jar is pure sugar and palm oil." },
      { claim: "Great Start to the Day / Breakfast Essential", verdict: "Breakfast Dessert", explanation: "Two spoonfuls on toast contain more sugar than three chocolate chip cookies." }
    ],
    realityCheck: "If you dissect a jar of Nutella, over 56% is granulated sugar, and roughly 30% is refined palm oil. Hazelnuts and cocoa powder comprise only a tiny fraction. It is a confection masquerading as a wholesome morning nut spread.",
    ingredientsList: "Sugar (56%), Palm Oil, Hazelnuts (13%), Skimmed Cow Milk Powder (8.7%), Low Fat Cocoa Powder (7.4%), Emulsifier (INS 322 - Lecithin), Vanillin Flavour.",
    flaggedIngredients: [
      { name: "Sugar (56.3%)", reason: "More than half of the jar is refined white sugar", severity: "high" },
      { name: "Palm Oil", reason: "Second largest ingredient; provides heavy saturated fatty acids", severity: "high" },
      { name: "Low Real Nut Content", reason: "Only 13% hazelnuts despite being named 'Hazelnut Spread'", severity: "medium" }
    ],
    nutritionPer100g: {
      calories: 539,
      carbs: 57.5,
      totalSugars: 56.3,
      addedSugars: 50.0,
      protein: 6.3,
      fat: 30.9,
      saturatedFat: 10.6,
      sodium: 42
    },
    cleanAlternativeId: "clean-peanut-butter",
    cleanAlternativeName: "The Whole Truth 100% Peanuts Butter (Dark Chocolate)",
    cleanAlternativeSavings: "-45g Sugar, 0 Palm Oil, +20g Pure Plant Protein, 100% Real Nuts"
  },
  {
    id: "kelloggs-chocos",
    name: "Kellogg's Chocos Chocolate Wheat Cereal",
    brand: "Kellogg's",
    category: "cereals",
    isVeg: true,
    novaClass: 4,
    allergens: ["Wheat Gluten", "Soy Lecithin"],
    image: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
    truthScore: 36,
    status: "avoid",
    ratingLabel: "31% Sugar / Ultra-Processed",
    sugarGramsPer100g: 31.5,
    sugarCubesPerServing: 2.5,
    servingSize: "30g bowl",
    palmOil: true,
    palmOilDetails: "Uses refined Palmolein for crispy shelf life.",
    matchRatings: {
      general: { score: 36, status: "avoid", note: "Nearly one-third of the cereal is pure added sugar and invert syrup." },
      diabetes: { score: 20, status: "avoid", note: "Fast digesting refined starch + 31.5% sugar." },
      kids: { score: 28, status: "avoid", note: "Revant Himatsingka debunked the 'Roti jaisa poshan' marketing claim." },
      fitness: { score: 32, status: "avoid", note: "Low fiber, high sugar; causes mid-morning energy crash." },
      weight: { score: 25, status: "avoid", note: "Triggers cravings through rapid blood sugar swings." }
    },
    frontClaims: [
      { claim: "Made with Whole Grain / High in Calcium & Protein", verdict: "Health Washing", explanation: "Whole grain is combined with 31.5% sugar and glucose syrup, destroying its glycemic benefits." },
      { claim: "Roti Jaisa Poshan (Nutrition of a Roti)", verdict: "Debunked by FoodPharmer", explanation: "A roti has 0g added sugar. One serving of Chocos has ~2.5 teaspoons of sugar!" }
    ],
    realityCheck: "Famous for its campaign claiming the nutrition of one roti in a bowl. However, a traditional roti has ZERO added sugar and simple whole wheat, whereas Chocos has 31.5g sugar per 100g, invert syrup, glucose, and caramel colors. It is breakfast confectionery.",
    ingredientsList: "Wheat Flour (54.5%), Sugar (31.5%), Cocoa Solids (5.4%), Edible Vegetable Oil (Palmolein), Invert Sugar, Minerals, Caramel Colour (INS 150d), Emulsifier (INS 322), Vitamins, Antioxidant (INS 320).",
    flaggedIngredients: [
      { name: "Sugar (31.5g/100g)", reason: "Nearly one-third of breakfast cereal is pure added sugar", severity: "high" },
      { name: "Invert Sugar Syrup", reason: "Extra simple syrup to make flakes crunchy and sweet", severity: "high" },
      { name: "INS 150d (Caramel IV)", reason: "Processed with ammonium and sulphite compounds", severity: "medium" },
      { name: "Palmolein", reason: "Refined palm oil used for crispness", severity: "medium" }
    ],
    nutritionPer100g: {
      calories: 382,
      carbs: 83.1,
      totalSugars: 31.5,
      addedSugars: 29.5,
      protein: 7.8,
      fat: 2.8,
      saturatedFat: 1.2,
      sodium: 230
    },
    cleanAlternativeId: "yogabar-muesli",
    cleanAlternativeName: "Yoga Bar Dark Chocolate Rolled Oats Muesli",
    cleanAlternativeSavings: "-20g Sugar, High Beta-Glucan Oats Fiber, No Palm Oil or Invert Syrup"
  },
  {
    id: "britannia-good-day",
    name: "Britannia Good Day Cashew Cookies",
    brand: "Britannia",
    category: "biscuits",
    isVeg: true,
    novaClass: 4,
    allergens: ["Wheat Gluten", "Cashew Nuts (Tree Nuts)", "Milk Solids", "Soy Lecithin"],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
    truthScore: 30,
    status: "avoid",
    ratingLabel: "Palm Oil + 2% Cashew Gimmick",
    sugarGramsPer100g: 28.5,
    sugarCubesPerServing: 2.2,
    servingSize: "30g (4 biscuits)",
    palmOil: true,
    palmOilDetails: "Uses refined Palmolein as primary shortening fat.",
    matchRatings: {
      general: { score: 30, status: "avoid", note: "Palmolein fat + 28.5% sugar with only 1.9% cashew nuts." },
      diabetes: { score: 22, status: "avoid", note: "Invert syrup and refined maida." },
      kids: { score: 25, status: "avoid", note: "Deceptive 'Cashew and Butter' label hides 23% cheap palm oil." },
      fitness: { score: 28, status: "avoid", note: "High saturated fat (10.8g), low protein." },
      weight: { score: 20, status: "avoid", note: "Over 500 kcal per 100g." }
    },
    frontClaims: [
      { claim: "With Rich Cashews and Butter", verdict: "Micro-dosed Nuts", explanation: "Contains merely 1.9% cashew nuts and 0.5% butter. The bulk is palmolein fat." },
      { claim: "Smiles in Every Bite", verdict: "High Glycemic Shock", explanation: "Refined maida and palm oil combined with 28.5% sugar." }
    ],
    realityCheck: "Marketed as a premium 'Cashew and Butter' cookie with giant cashew illustrations on the pack. In reality, cashews make up less than 2% of the biscuit, and butter is a negligible 0.5%! The shortening is cheap palmolein, and every bite is 28.5% sugar.",
    ingredientsList: "Refined Wheat Flour (Maida), Sugar (28.5%), Refined Palm Oil, Cashew Bits (1.9%), Butter (0.5%), Invert Sugar Syrup, Milk Solids, Raising Agents (INS 503(ii), INS 500(ii)), Salt, Emulsifiers (INS 322, INS 471), Artificial Flavours (Butter, Vanilla).",
    flaggedIngredients: [
      { name: "Palm Oil (Palmolein)", reason: "Chief shortening fat used instead of real butter", severity: "high" },
      { name: "Cashews (only 1.9%)", reason: "Misleading marketing label when 98% is maida, sugar and palm oil", severity: "high" },
      { name: "Sugar (28.5g/100g)", reason: "High added sugar content", severity: "high" },
      { name: "INS 471 (Mono & Diglycerides)", reason: "Industrial emulsifier to stabilize fat-water blend", severity: "low" }
    ],
    nutritionPer100g: {
      calories: 504,
      carbs: 68.0,
      totalSugars: 28.5,
      addedSugars: 27.0,
      protein: 6.0,
      fat: 23.0,
      saturatedFat: 10.8,
      sodium: 320
    },
    cleanAlternativeId: "the-whole-truth-biscuit",
    cleanAlternativeName: "The Whole Truth 100% Clean Almond Butter Cookies",
    cleanAlternativeSavings: "0 Palm Oil (100% Butter/Desi Ghee), 25% Real Nuts, Zero Refined Sugar"
  },

  // -------------------------------------------------------------
  // VERIFIED CLEAN ALTERNATIVES / "TRUTH APPROVED" PRODUCTS
  // -------------------------------------------------------------
  {
    id: "clean-sattu",
    name: "Organic Roasted Chana Sattu (Desi Superfood)",
    brand: "Traditional / Two Brothers Organic",
    category: "beverages",
    isVeg: true,
    novaClass: 1, // Whole food unprocessed
    allergens: ["None (Gluten Free)"],
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    truthScore: 96,
    status: "clean",
    ratingLabel: "100% Clean / High Protein Superfood",
    sugarGramsPer100g: 1.5,
    sugarCubesPerServing: 0,
    servingSize: "30g (with water/buttermilk)",
    palmOil: false,
    palmOilDetails: "Zero added oil or fat.",
    matchRatings: {
      general: { score: 96, status: "clean", note: "100% pure roasted chana with zero additives or maltodextrin." },
      diabetes: { score: 98, status: "clean", note: "EXCELLENT: Low glycemic index (GI ~28) with high dietary fiber." },
      kids: { score: 95, status: "clean", note: "Natural plant iron, magnesium, and slow energy for children." },
      fitness: { score: 96, status: "clean", note: "23g natural clean plant protein per 100g." },
      weight: { score: 94, status: "clean", note: "High satiety fiber stops hunger cravings for hours." }
    },
    frontClaims: [
      { claim: "100% Pure Roasted Bengal Gram (Chana)", verdict: "Verified 100% True", explanation: "Only one single natural ingredient. Stone-ground whole grain with bran intact." },
      { claim: "Natural Plant Protein & Low GI Energy", verdict: "Scientifically Backed", explanation: "Provides 23g protein per 100g without a single gram of added sugar." }
    ],
    realityCheck: "The original Indian protein drink. Zero added sugar, zero maltodextrin, zero palm oil, and zero synthetic INS chemical preservatives. Rich in dietary fiber, iron, and magnesium.",
    ingredientsList: "100% Stone-Ground Roasted Bengal Gram (Chana). Nothing else.",
    flaggedIngredients: [],
    nutritionPer100g: {
      calories: 385,
      carbs: 61.0,
      totalSugars: 1.5,
      addedSugars: 0,
      protein: 23.0,
      fat: 5.2,
      saturatedFat: 0.8,
      sodium: 18
    },
    cleanAlternativeId: null,
    cleanAlternativeName: "Already Top Clean Choice",
    cleanAlternativeSavings: "Gold Standard Clean Food"
  },
  {
    id: "slurrp-farm-millet-noodles",
    name: "Slurrp Farm Foxtail Millet Hakka Noodles",
    brand: "Slurrp Farm",
    category: "instant-meals",
    isVeg: true,
    novaClass: 3,
    allergens: ["Whole Wheat (Atta)"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    truthScore: 92,
    status: "clean",
    ratingLabel: "100% Not Fried / Zero Palm Oil",
    sugarGramsPer100g: 1.8,
    sugarCubesPerServing: 0,
    servingSize: "75g",
    palmOil: false,
    palmOilDetails: "Not deep-fried! Steam-cooked and sun-dried.",
    matchRatings: {
      general: { score: 92, status: "clean", note: "100% sun-dried millets & whole wheat. Zero palmolein oil." },
      diabetes: { score: 85, status: "clean", note: "Foxtail millet provides complex carbohydrates and high fiber." },
      kids: { score: 95, status: "clean", note: "Clean spices seasoning packet with zero MSG or synthetic INS 635." },
      fitness: { score: 88, status: "clean", note: "12.5g protein and minimal fat (2.1g vs 15.7g in Maggi)." },
      weight: { score: 90, status: "clean", note: "Not fried, saving over 12g of absorbed cooking oil." }
    },
    frontClaims: [
      { claim: "Zero Maida, Zero Palm Oil, Not Fried", verdict: "Verified Clean Label", explanation: "Noodles are sun-dried rather than flash-fried in commercial palmolein." },
      { claim: "Made with Foxtail Millet & Whole Wheat", verdict: "True High Fiber", explanation: "Contains over 9g dietary fiber with no artificial flavour enhancers." }
    ],
    realityCheck: "Unlike commercial 2-minute instant noodles that are deep-fried in palm oil, Slurrp Farm noodles are air-dried. The seasoning packet uses real spices without INS 635 or hydrolyzed vegetable protein.",
    ingredientsList: "Noodles: Foxtail Millet Flour (40%), Whole Wheat Flour (Atta) (58%), Cluster Bean Powder, Salt. Spice Mix: Cumin, Coriander, Turmeric, Black Pepper, Ginger, Cardamom, Clove, Rock Salt, Raw Mango Powder.",
    flaggedIngredients: [],
    nutritionPer100g: {
      calories: 362,
      carbs: 72.0,
      totalSugars: 1.8,
      addedSugars: 0,
      protein: 12.5,
      fat: 2.1,
      saturatedFat: 0.4,
      sodium: 380
    },
    cleanAlternativeId: null,
    cleanAlternativeName: "Already Top Clean Choice",
    cleanAlternativeSavings: "Gold Standard Clean Food"
  },
  {
    id: "the-whole-truth-biscuit",
    name: "The Whole Truth 100% Clean Almond Butter Cookies",
    brand: "The Whole Truth",
    category: "biscuits",
    isVeg: true,
    novaClass: 3,
    allergens: ["Almonds (Tree Nuts)", "Real Dairy Butter", "Oats"],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60",
    truthScore: 94,
    status: "clean",
    ratingLabel: "Zero Added Sugar / Zero Palm Oil",
    sugarGramsPer100g: 16.0,
    sugarCubesPerServing: 0,
    servingSize: "30g (2 cookies)",
    palmOil: false,
    palmOilDetails: "Zero palm oil. Made exclusively with Real Dairy Butter.",
    matchRatings: {
      general: { score: 94, status: "clean", note: "Sweetened strictly with whole dates. Real butter instead of palmolein." },
      diabetes: { score: 82, status: "clean", note: "Contains natural date fruit sugar with intact soluble fiber." },
      kids: { score: 96, status: "clean", note: "100% whole food ingredients with zero preservatives or chemical aromas." },
      fitness: { score: 88, status: "clean", note: "10.5g protein and healthy fats from whole almonds and butter." },
      weight: { score: 86, status: "clean", note: "Provides real satiety from oat beta-glucan fiber." }
    },
    frontClaims: [
      { claim: "Zero Refined Sugar / Sweetened Only with Dates", verdict: "Verified True", explanation: "Uses whole date powder, retaining natural fruit fiber and potassium." },
      { claim: "Zero Palm Oil, Zero Maida, Zero Emulsifiers", verdict: "100% Back Label Matches Front", explanation: "Front label lists every single ingredient clearly." }
    ],
    realityCheck: "A revolutionary clean-label biscuit inspired by the transparency movement. Every single ingredient is declared in large font on the front of the pack: Oat flour, Almonds, Dates, Butter. No hidden INS codes.",
    ingredientsList: "Rolled Oats (38%), Dates (28%), Real Butter (20%), Almonds (14%), Salt. That's it.",
    flaggedIngredients: [],
    nutritionPer100g: {
      calories: 450,
      carbs: 52.0,
      totalSugars: 16.0,
      addedSugars: 0,
      protein: 10.5,
      fat: 22.0,
      saturatedFat: 8.5,
      sodium: 140
    },
    cleanAlternativeId: null,
    cleanAlternativeName: "Already Top Clean Choice",
    cleanAlternativeSavings: "Gold Standard Clean Food"
  },
  {
    id: "tender-coconut",
    name: "Fresh Natural Tender Coconut Water",
    brand: "Mother Nature / Local",
    category: "beverages",
    isVeg: true,
    novaClass: 1,
    allergens: ["None"],
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60",
    truthScore: 98,
    status: "clean",
    ratingLabel: "100% Raw Natural Electrolytes",
    sugarGramsPer100g: 3.5,
    sugarCubesPerServing: 0,
    servingSize: "250ml coconut",
    palmOil: false,
    palmOilDetails: "Zero oil.",
    matchRatings: {
      general: { score: 98, status: "clean", note: "Pure live electrolytes with 600mg potassium. Zero processing." },
      diabetes: { score: 92, status: "clean", note: "Very low glycemic load compared to packaged soft drinks." },
      kids: { score: 99, status: "clean", note: "The healthiest hydration alternative to colas and energy drinks." },
      fitness: { score: 95, status: "clean", note: "Ideal post-exercise natural rehydration." },
      weight: { score: 98, status: "clean", note: "Only 19 kcal per 100ml." }
    },
    frontClaims: [
      { claim: "Natural Isotonic Drink with Potassium & Magnesium", verdict: "Scientifically Proven", explanation: "Identical osmolarity to body fluid; perfect post-workout rehydration." }
    ],
    realityCheck: "Nature's perfect sports drink. Zero added sugar, zero synthetic food dyes (like Red 40 in Sting), zero caffeine spikes. Contains 600mg potassium per coconut to naturally lower blood pressure.",
    ingredientsList: "100% Pure Raw Tender Coconut Water. Zero additives.",
    flaggedIngredients: [],
    nutritionPer100g: {
      calories: 19,
      carbs: 3.7,
      totalSugars: 3.2,
      addedSugars: 0,
      protein: 0.7,
      fat: 0.2,
      saturatedFat: 0.1,
      sodium: 105
    },
    cleanAlternativeId: null,
    cleanAlternativeName: "Already Top Clean Choice",
    cleanAlternativeSavings: "Gold Standard Clean Food"
  },
  {
    id: "clean-peanut-butter",
    name: "The Whole Truth 100% Peanuts Natural Peanut Butter",
    brand: "The Whole Truth",
    category: "spreads",
    isVeg: true,
    novaClass: 1,
    allergens: ["Peanuts"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    labelImage: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60",
    truthScore: 97,
    status: "clean",
    ratingLabel: "Single Ingredient: 100% Slow Roasted Peanuts",
    sugarGramsPer100g: 4.8,
    sugarCubesPerServing: 0,
    servingSize: "32g (2 spoons)",
    palmOil: false,
    palmOilDetails: "Zero palm oil. Natural peanut oil separation proves no hydrogenated fat stabilizers.",
    matchRatings: {
      general: { score: 97, status: "clean", note: "One single ingredient: 100% peanuts. Zero added sugar or palmolein." },
      diabetes: { score: 96, status: "clean", note: "Zero added sugar, high healthy monounsaturated fats regulate insulin." },
      kids: { score: 95, status: "clean", note: "Clean healthy nut fats without the 56% sugar in Nutella." },
      fitness: { score: 99, status: "clean", note: "30g natural plant protein per 100g." },
      weight: { score: 90, status: "clean", note: "Highly satiating dense nutrition." }
    },
    frontClaims: [
      { claim: "Only 1 Ingredient: Peanuts", verdict: "100% Verified Truth", explanation: "No added sugar, zero salt, zero palm oil, zero hydrogenated vegetable fats." },
      { claim: "30g Natural Plant Protein per 100g", verdict: "Verified Nutrient Density", explanation: "Packed with heart-healthy monounsaturated fats (MUFA) and vitamin E." }
    ],
    realityCheck: "The exact opposite of Nutella. While Nutella is 56% sugar and 30% palm oil, this clean spread has literally ONE ingredient: slow roasted peanuts. No chemical stabilizers or emulsifiers.",
    ingredientsList: "100% Slow-Roasted Peanuts. Nothing else.",
    flaggedIngredients: [],
    nutritionPer100g: {
      calories: 590,
      carbs: 18.0,
      totalSugars: 4.8,
      addedSugars: 0,
      protein: 30.0,
      fat: 49.0,
      saturatedFat: 7.2,
      sodium: 12
    },
    cleanAlternativeId: null,
    cleanAlternativeName: "Already Top Clean Choice",
    cleanAlternativeSavings: "Gold Standard Clean Food"
  }
];

// ============================================================================
// TRUTHIN FOOD SUGGESTIONS & SMART SWAPS MATRIX TABLE
// Direct "Instead of X, Eat Y" comparison table
// ============================================================================
const FOOD_SWAPS_TABLE = [
  {
    id: "swap-1",
    category: "Beverages & Health Drinks",
    badProduct: {
      name: "Cadbury Bournvita",
      brand: "Mondelez",
      score: 28,
      status: "avoid",
      concerns: "49.8% Sugar, Maltodextrin, Liquid Glucose, INS 150c",
      sugarPer100g: "49.8g",
      palmOil: "No (Uses Liquid Glucose)"
    },
    goodProduct: {
      name: "Roasted Chana Sattu Milk / Raw Cacao",
      brand: "Traditional Desi",
      score: 96,
      status: "clean",
      benefits: "Zero Added Sugar, 23g Natural Protein, High Fiber",
      sugarPer100g: "1.5g",
      palmOil: "Zero Oil"
    },
    sugarReduction: "-48.3g Sugar",
    swapVerdict: "Massive 96% reduction in sugar and triple the natural protein without synthetic additives."
  },
  {
    id: "swap-2",
    category: "Instant Noodles & Meals",
    badProduct: {
      name: "Maggi 2-Minute Masala Noodles",
      brand: "Nestle",
      score: 32,
      status: "avoid",
      concerns: "Deep-Fried in Palmolein, Refined Maida, 1220mg Sodium, INS 635",
      sugarPer100g: "2.2g",
      palmOil: "YES (Palmolein Fried)"
    },
    goodProduct: {
      name: "Slurrp Farm Foxtail Millet Noodles",
      brand: "Slurrp Farm",
      score: 92,
      status: "clean",
      benefits: "Sun-Dried (Not Fried), 100% Millets & Atta, Real Spices",
      sugarPer100g: "1.8g",
      palmOil: "ZERO Palm Oil"
    },
    sugarReduction: "0 Palm Oil (-85% Bad Fat)",
    swapVerdict: "Eliminates deep-fried industrial palmolein and refined maida entirely."
  },
  {
    id: "swap-3",
    category: "Biscuits & Cookies",
    badProduct: {
      name: "Britannia Good Day Cashew",
      brand: "Britannia",
      score: 30,
      status: "avoid",
      concerns: "Palmolein Fat, 28.5% Sugar, Only 1.9% Cashew gimmick",
      sugarPer100g: "28.5g",
      palmOil: "YES (Refined Palmolein)"
    },
    goodProduct: {
      name: "The Whole Truth Almond Butter Cookies",
      brand: "The Whole Truth",
      score: 94,
      status: "clean",
      benefits: "100% Real Butter, 25% Real Nuts, Sweetened with Dates",
      sugarPer100g: "16.0g (Date fiber)",
      palmOil: "ZERO Palm Oil"
    },
    sugarReduction: "-28.5g Refined Sugar",
    swapVerdict: "Replaces cheap palm fat with real dairy butter and eliminates white table sugar."
  },
  {
    id: "swap-4",
    category: "Energy Drinks & Sodas",
    badProduct: {
      name: "Sting Energy Drink",
      brand: "PepsiCo",
      score: 18,
      status: "avoid",
      concerns: "34g Liquid Sugar per bottle, Red 40 (INS 129), Sodium Benzoate",
      sugarPer100g: "13.7g",
      palmOil: "No (Pure Liquid Sugar)"
    },
    goodProduct: {
      name: "Fresh Tender Coconut Water",
      brand: "Natural",
      score: 98,
      status: "clean",
      benefits: "600mg Potassium, 0 Added Sugar, Zero Artificial Dyes",
      sugarPer100g: "3.2g",
      palmOil: "Zero Fat"
    },
    sugarReduction: "-34g Added Sugar",
    swapVerdict: "Avoids synthetic caffeine and dangerous azo dyes linked to hyperactivity."
  },
  {
    id: "swap-5",
    category: "Breakfast Cereals",
    badProduct: {
      name: "Kellogg's Chocos Flakes",
      brand: "Kellogg's",
      score: 36,
      status: "avoid",
      concerns: "31.5% Sugar, Invert Syrup, Palmolein, INS 150d Caramel",
      sugarPer100g: "31.5g",
      palmOil: "YES (Palmolein)"
    },
    goodProduct: {
      name: "Yoga Bar Dark Chocolate Muesli",
      brand: "Yoga Bar",
      score: 86,
      status: "clean",
      benefits: "82% Rolled Oats & Seeds, Zero Invert Syrup, High Fiber",
      sugarPer100g: "11.5g",
      palmOil: "ZERO Palm Oil"
    },
    sugarReduction: "-20g Added Sugar",
    swapVerdict: "Provides real sustained satiety from beta-glucan oat fiber instead of a glycemic crash."
  },
  {
    id: "swap-6",
    category: "Spreads & Butters",
    badProduct: {
      name: "Nutella Hazelnut Spread",
      brand: "Ferrero",
      score: 22,
      status: "avoid",
      concerns: "56.3% Sugar, 30% Palm Oil, Only 13% Hazelnuts",
      sugarPer100g: "56.3g",
      palmOil: "YES (~30% Palm Oil)"
    },
    goodProduct: {
      name: "100% Peanuts Natural Peanut Butter",
      brand: "The Whole Truth",
      score: 97,
      status: "clean",
      benefits: "Only 1 Ingredient, Zero Sugar, 30g Protein, Zero Palm Oil",
      sugarPer100g: "4.8g (natural)",
      palmOil: "ZERO Palm Oil"
    },
    sugarReduction: "-51.5g Sugar",
    swapVerdict: "Transforms an ultra-processed sugar-fat dessert into a powerhouse protein snack."
  }
];

// ============================================================================
// COMPREHENSIVE INS / E-NUMBER DECODER DICTIONARY
// Over 50+ common additives found on packaged food labels in India & Global
// ============================================================================
const INS_DICTIONARY = [
  {
    code: "INS 150d",
    name: "Caramel IV (Ammonia Sulphite Caramel)",
    type: "Artificial Colour",
    safety: "Harmful",
    description: "Manufactured by heating carbohydrates with ammonium and sulphite compounds. Can contain 4-methylimidazole (4-MEI), classified by IARC as possibly carcinogenic to humans.",
    foundIn: "Colas, dark chocolate biscuits, packaged cakes, dark gravy mixes."
  },
  {
    code: "INS 150c",
    name: "Caramel III (Ammonia Caramel)",
    type: "Artificial Colour",
    safety: "Caution",
    description: "Prepared using ammonium compounds. Common in malt health drinks (like Bournvita), beers, and sauces.",
    foundIn: "Bournvita, soy sauce, brown bread."
  },
  {
    code: "INS 621",
    name: "Monosodium Glutamate (MSG)",
    type: "Flavour Enhancer",
    safety: "Caution",
    description: "Sodium salt of glutamic acid. Overstimulates taste receptors to make bland processed foods taste intensely savory.",
    foundIn: "Instant noodles, potato chips, Chinese sauces, snack seasonings."
  },
  {
    code: "INS 627",
    name: "Disodium Guanylate",
    type: "Flavour Enhancer",
    safety: "Caution",
    description: "Synthetic ribonucleotide flavor enhancer. Synergizes with MSG to multiply salt perception.",
    foundIn: "Kurkure, packaged chips, soup cubes."
  },
  {
    code: "INS 631",
    name: "Disodium Inosinate",
    type: "Flavour Enhancer",
    safety: "Caution",
    description: "Often paired with INS 627 to heighten umami. Derived from microbial fermentation or animal origin.",
    foundIn: "Extruded snacks, instant ramen, namkeen seasonings."
  },
  {
    code: "INS 635",
    name: "Disodium 5'-Ribonucleotides",
    type: "Flavour Enhancer",
    safety: "Caution",
    description: "Blend of INS 627 and INS 631. Highly potent flavor potentiator used to cut costs on real herbs and spices.",
    foundIn: "Maggi Masala Tastemaker, ready-to-eat gravies."
  },
  {
    code: "INS 129",
    name: "Allura Red AC (Red 40)",
    type: "Synthetic Food Dye",
    safety: "Harmful",
    description: "Coal tar-derived azo dye. Banned in parts of Europe or requires mandatory warning label: 'May have an adverse effect on activity and attention in children'.",
    foundIn: "Sting energy drink, strawberry wafers, red candy, fruit syrups."
  },
  {
    code: "INS 110",
    name: "Sunset Yellow FCF",
    type: "Synthetic Food Dye",
    safety: "Harmful",
    description: "Synthetic petroleum-derived yellow dye. Linked to allergies, hives, and hyperactivity in sensitive individuals.",
    foundIn: "Tang orange drink, orange sodas, mango soft drinks, custard powders."
  },
  {
    code: "INS 211",
    name: "Sodium Benzoate",
    type: "Chemical Preservative",
    safety: "Harmful",
    description: "Antimicrobial preservative. In the presence of Vitamin C and heat/light, can react to form trace amounts of benzene, a known carcinogen.",
    foundIn: "Kissan ketchup, soft drinks, fruit crushes, salad dressings."
  },
  {
    code: "INS 319",
    name: "TBHQ (Tertiary Butylhydroquinone)",
    type: "Synthetic Antioxidant",
    safety: "Harmful",
    description: "Petroleum-derived preservative added to cheap commercial cooking oils to prevent rancidity. Studies link prolonged exposure to immune impairment.",
    foundIn: "Commercial fried chips, biscuits, namkeen fried in palmolein."
  },
  {
    code: "INS 951",
    name: "Aspartame",
    type: "Artificial Sweetener",
    safety: "Harmful",
    description: "Intense chemical sweetener (200x sweeter than sugar). Classified as 'possibly carcinogenic to humans' (Group 2B) by the WHO IARC.",
    foundIn: "Diet colas, 'Sugar Free' chewing gums, low-calorie yogurts."
  },
  {
    code: "INS 471",
    name: "Mono- and Di-glycerides of Fatty Acids",
    type: "Emulsifier",
    safety: "Caution",
    description: "Industrial emulsifier used to blend water and cheap oils. Can contain hidden trans fats that do not show up due to rounding rules.",
    foundIn: "White bread, peanut butter spreads, biscuits, ice cream."
  },
  {
    code: "INS 330",
    name: "Citric Acid",
    type: "Acidity Regulator",
    safety: "Safe",
    description: "Generally recognized as safe organic acid. Mostly produced industrially via Aspergillus niger fungal fermentation of molasses.",
    foundIn: "Sodas, fruit juices, candies, jams."
  },
  {
    code: "INS 322",
    name: "Lecithin (Soy / Sunflower)",
    type: "Natural Emulsifier",
    safety: "Safe",
    description: "Naturally occurring phospholipid found in egg yolks and soybeans. Safe for general consumption unless allergic to soy.",
    foundIn: "Chocolates, bakery items, margarines."
  }
];

// Export to window for global access without module bundlers
if (typeof window !== "undefined") {
  window.NUTRITRUTH_DATA = {
    products: PRODUCTS_DATA,
    swaps: FOOD_SWAPS_TABLE,
    insDictionary: INS_DICTIONARY
  };
}
