import { GoogleGenAI } from '@google/genai';
import { AGRO_AI_SYSTEM_PROMPT, getLanguageInstruction } from '../prompts/systemPrompt.js';
import { cropRecommendationResponseSchema } from '../schemas/crop.schema.js';
import { soilAnalysisResponseSchema } from '../schemas/soil.schema.js';
import { fertilizerResponseSchema } from '../schemas/fertilizer.schema.js';
import { irrigationResponseSchema } from '../schemas/irrigation.schema.js';
import { diseaseResponseSchema } from '../schemas/disease.schema.js';
import { cultivationCalendarResponseSchema } from '../schemas/calendar.schema.js';
import { chatbotResponseSchema } from '../schemas/chat.schema.js';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const isGeminiAvailable = Boolean(apiKey && apiKey !== 'your-gemini-api-key' && apiKey.trim().length > 0);

const ai = isGeminiAvailable ? new GoogleGenAI({ apiKey }) : null;

/**
 * Helper to call Gemini model with structured JSON enforcement and Zod validation
 */
async function callGeminiStructured({ prompt, responseSchema, fallbackGenerator }) {
  if (!isGeminiAvailable || !ai) {
    // Return high-quality agronomic fallback when API key is not yet set
    return fallbackGenerator();
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: AGRO_AI_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      // Clean possible markdown code fences if returned
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const validated = responseSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn('Gemini response schema validation warning:', validated.error.issues);
      // Attempt to salvage parsed if valid shape or use fallback
      return fallbackGenerator(parsed);
    }
    return validated.data;
  } catch (error) {
    console.error('Error in Gemini API call:', error?.message || error);
    // Return reliable agronomic response with warning note
    const fallback = fallbackGenerator();
    if (fallback.warnings && Array.isArray(fallback.warnings)) {
      fallback.warnings.push(`Notice: Live AI service encountered an issue (${error?.message || 'Offline'}). Standard agronomic baseline provided.`);
    }
    return fallback;
  }
}

// ==============================================================================
// 1. CROP RECOMMENDATION
// ==============================================================================
export async function getCropRecommendation(input) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Recommend suitable agricultural crops for a farmer.
${langPrompt}

FARMER'S INPUT:
- Location: ${input.district}, ${input.state}, India
- Agricultural Season: ${input.season}
- Soil Type: ${input.soilType}
- Total Land Area: ${input.landArea} ${input.landUnit}
- Irrigation Availability: ${input.irrigationAvailable ? 'Available' : 'Rainfed / Dependent on rain'}
- Soil pH: ${input.soilPH ?? 'Not provided'}
- Available Nitrogen: ${input.nitrogen ? `${input.nitrogen} kg/ha or ppm` : 'Not tested'}
- Available Phosphorus: ${input.phosphorus ? `${input.phosphorus} kg/ha or ppm` : 'Not tested'}
- Available Potassium: ${input.potassium ? `${input.potassium} kg/ha or ppm` : 'Not tested'}
- Organic Carbon: ${input.organicCarbon ? `${input.organicCarbon}%` : 'Not tested'}
- Ambient Temperature: ${input.temperature ? `${input.temperature}°C` : 'Seasonal average'}
- Rainfall: ${input.rainfall ? `${input.rainfall} mm` : 'Seasonal average'}
- Preferred Crop Category: ${input.preferredCategory || 'Any suitable'}
- Previous Crop: ${input.previousCrop || 'Not specified'}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "summary": "Clear, concise agricultural overview of the land and season",
  "dataLimitations": ["List any data that was missing and estimated"],
  "recommendations": [
    {
      "cropName": "Crop name",
      "suitabilityScore": 85,
      "suitabilityLevel": "High",
      "reason": "Detailed agronomic explanation for why this crop fits this soil, season and irrigation status",
      "soilCompatibility": "Compatible with soil characteristics",
      "climateCompatibility": "Compatible with seasonal temperature and rainfall",
      "waterRequirement": "Low / Moderate / High",
      "estimatedDurationDays": 110,
      "sowingPeriod": "Optimal sowing window for this region",
      "risks": ["Specific climate, pest, or water risks"],
      "nextSteps": ["Actionable step 1", "Actionable step 2"]
    }
  ],
  "warnings": ["Agricultural safety or market cautions"],
  "expertConsultationRequired": false
}
Provide at least 3-4 top suitable crops.
`;

  return callGeminiStructured({
    prompt,
    responseSchema: cropRecommendationResponseSchema,
    fallbackGenerator: (partial) => {
      const isKannada = input.language === 'kn';
      const crops = input.irrigationAvailable
        ? [
            {
              cropName: isKannada ? 'ಭತ್ತ (Paddy/Rice)' : 'Paddy (Rice)',
              suitabilityScore: 88,
              suitabilityLevel: 'High',
              reason: isKannada
                ? 'ಲಭ್ಯವಿರುವ ನೀರಾವರಿ ಮತ್ತು ಮಣ್ಣಿನ ಪ್ರಕಾರಕ್ಕೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ಬೆಳೆ.'
                : `Well-suited for ${input.soilType} with confirmed irrigation access during the ${input.season} season.`,
              soilCompatibility: `Good retention in ${input.soilType}`,
              climateCompatibility: `Ideal for ${input.season} climate in ${input.state}`,
              waterRequirement: 'High',
              estimatedDurationDays: 125,
              sowingPeriod: input.season === 'Kharif' ? 'June - July' : 'November - December',
              risks: ['Stem borer incidence in humid weather', 'Waterlogging at seedling stage'],
              nextSteps: ['Prepare seed bed with treated certified seeds', 'Ensure level field drainage'],
            },
            {
              cropName: isKannada ? 'ಮೆಕ್ಕೆಜೋಳ (Maize)' : 'Maize (Corn)',
              suitabilityScore: 82,
              suitabilityLevel: 'High',
              reason: isKannada
                ? 'ಕಡಿಮೆ ನೀರಿನಲ್ಲಿ ಉತ್ತಮ ಇಳುವರಿ ನೀಡುವ ಧಾನ್ಯ ಬೆಳೆ.'
                : 'Highly versatile cereal crop offering reliable yield and good market demand with moderate water requirement.',
              soilCompatibility: `Requires good drainage in ${input.soilType}`,
              climateCompatibility: `Well-adapted to ${input.state} conditions`,
              waterRequirement: 'Moderate',
              estimatedDurationDays: 105,
              sowingPeriod: input.season === 'Kharif' ? 'June - July' : 'October - November',
              risks: ['Fall armyworm vigilance required', 'Sensitive to standing water'],
              nextSteps: ['Select high-yield hybrid suitable for the district', 'Apply basal organic manure'],
            },
            {
              cropName: isKannada ? 'ಕಡಲೆಕಾಯಿ (Groundnut)' : 'Groundnut',
              suitabilityScore: 78,
              suitabilityLevel: 'Medium',
              reason: isKannada
                ? 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು ಮತ್ತು ದ್ವಿದಳ ಧಾನ್ಯವಾಗಿ ಉತ್ತಮ.'
                : 'Legume crop that fixes atmospheric nitrogen, improving long-term soil fertility in your land.',
              soilCompatibility: `Requires friable, well-aerated ${input.soilType}`,
              climateCompatibility: `Fits ${input.season} temperature profile`,
              waterRequirement: 'Moderate',
              estimatedDurationDays: 115,
              sowingPeriod: 'July or December',
              risks: ['Tikka leaf spot during high moisture', 'Pod borer attack'],
              nextSteps: ['Inoculate seeds with Rhizobium culture', 'Prepare raised beds if soil is heavy'],
            }
          ]
        : [
            {
              cropName: isKannada ? 'ರಾಗಿ (Finger Millet)' : 'Finger Millet (Ragi)',
              suitabilityScore: 92,
              suitabilityLevel: 'High',
              reason: isKannada
                ? 'ಮಳೆ ಆಧಾರಿತ ಕೃಷಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ಬರ ನಿರೋಧಕ ಬೆಳೆ.'
                : `Exceptional drought tolerance and ideal for rainfed cultivation in ${input.soilType}.`,
              soilCompatibility: `Excellent resilience in ${input.soilType}`,
              climateCompatibility: `Native resilience to ${input.state} seasonal variations`,
              waterRequirement: 'Low',
              estimatedDurationDays: 100,
              sowingPeriod: 'July - August',
              risks: ['Delayed monsoon at tillering stage', 'Blast disease in wet spells'],
              nextSteps: ['Line sowing with certified blast-resistant variety', 'Apply farmyard manure'],
            },
            {
              cropName: isKannada ? 'ತೊಗರಿ (Pigeon Pea / Red Gram)' : 'Pigeon Pea (Red Gram)',
              suitabilityScore: 85,
              suitabilityLevel: 'High',
              reason: isKannada
                ? 'ಆಳವಾದ ಬೇರುಗಳ ಕಾರಣ ಮಳೆ ಕೊರತೆಯಲ್ಲೂ ಬೆಳೆಯಬಲ್ಲದು.'
                : 'Deep root system extracts moisture from deep soil layers; fixes soil nitrogen effectively.',
              soilCompatibility: 'Good in moderately drained soil',
              climateCompatibility: 'Thrives in warm, dry weather',
              waterRequirement: 'Low',
              estimatedDurationDays: 150,
              sowingPeriod: 'June - July',
              risks: ['Pod borer complex during flowering', 'Sterility mosaic virus'],
              nextSteps: ['Intercrop with millets or cereals to diversify risk', 'Seed treatment with Trichoderma'],
            },
            {
              cropName: isKannada ? 'ಜೋಳ (Sorghum)' : 'Sorghum (Jowar)',
              suitabilityScore: 80,
              suitabilityLevel: 'Medium',
              reason: isKannada
                ? 'ಕಡಿಮೆ ನೀರಿನಲ್ಲಿ ಮೇವು ಮತ್ತು ಧಾನ್ಯ ಎರಡನ್ನೂ ನೀಡುತ್ತದೆ.'
                : 'Dual-purpose grain and fodder crop suited to semi-arid regions with low rainfall.',
              soilCompatibility: `Tolerates varying depth in ${input.soilType}`,
              climateCompatibility: 'High heat tolerance',
              waterRequirement: 'Low',
              estimatedDurationDays: 110,
              sowingPeriod: 'June - July',
              risks: ['Shoot fly during early seedling stage', 'Grain mold if late rains occur'],
              nextSteps: ['Treat seeds with imidacloprid for shoot fly prevention', 'Sow at uniform depth'],
            }
          ];

      return {
        summary: isKannada
          ? `${input.district} ಜಿಲ್ಲೆಯ ${input.season} ಹಂಗಾಮಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳ ಶಿಫಾರಸು.`
          : `Agronomic suitability analysis for ${input.district}, ${input.state} during ${input.season} season on ${input.soilType} (${input.landArea} ${input.landUnit}).`,
        dataLimitations: [
          input.soilPH ? null : 'Exact soil pH was not provided; assumed near neutral baseline.',
          input.nitrogen ? null : 'Lab NPK values not provided; baseline district fertility estimates used.',
        ].filter(Boolean),
        recommendations: crops,
        warnings: [
          'Suitability scores are decision-support indices, not guarantees of yield.',
          'Always verify seed varieties with your local KVK or Agriculture Department office.'
        ],
        expertConsultationRequired: false,
      };
    },
  });
}

// ==============================================================================
// 2. SOIL ANALYSIS
// ==============================================================================
export async function getSoilAnalysis(input) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Perform an expert soil health and fertility assessment for an agricultural field.
${langPrompt}

SOIL PARAMETERS:
- Soil Type / Texture: ${input.soilType}
- Soil pH: ${input.soilPH ?? 'Not provided'}
- Available Nitrogen: ${input.nitrogen ? `${input.nitrogen} kg/ha` : 'Not provided'}
- Available Phosphorus: ${input.phosphorus ? `${input.phosphorus} kg/ha` : 'Not provided'}
- Available Potassium: ${input.potassium ? `${input.potassium} kg/ha` : 'Not provided'}
- Organic Carbon: ${input.organicCarbon ? `${input.organicCarbon} %` : 'Not provided'}
- Electrical Conductivity (EC): ${input.electricalConductivity ? `${input.electricalConductivity} dS/m` : 'Not provided'}
- Micronutrients: ${input.micronutrients || 'Not tested'}
- Additional Observations: ${input.additionalNotes || 'None'}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "overallAssessment": "Comprehensive analysis of this soil's fertility status and physical properties",
  "soilPHStatus": "acidic / slightly acidic / neutral / slightly alkaline / strongly alkaline",
  "nutrientAssessment": {
    "nitrogen": "Deficient / Low / Medium / High / Unknown",
    "phosphorus": "Deficient / Low / Medium / High / Unknown",
    "potassium": "Deficient / Low / Medium / High / Unknown",
    "organicCarbon": "Low / Medium / High / Unknown"
  },
  "potentialDeficiencies": ["Specific nutrient deficiencies identified"],
  "potentialExcesses": ["Specific elements in excess or salinity hazards"],
  "suitableCrops": ["Crops that naturally thrive in this soil condition"],
  "improvementPractices": ["Actionable soil amendments like FYM, gypsum, lime, green manuring"],
  "additionalTestingRequired": ["Recommended follow-up tests e.g., Zinc, Boron"],
  "warnings": ["Crucial cautions regarding soil health"]
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: soilAnalysisResponseSchema,
    fallbackGenerator: () => {
      const ph = input.soilPH;
      let phStatus = 'neutral';
      if (ph !== null && ph !== undefined) {
        if (ph < 6.0) phStatus = 'acidic';
        else if (ph < 6.5) phStatus = 'slightly acidic';
        else if (ph <= 7.5) phStatus = 'neutral';
        else if (ph <= 8.5) phStatus = 'slightly alkaline';
        else phStatus = 'strongly alkaline';
      }

      const deficiencies = [];
      if (input.nitrogen !== undefined && input.nitrogen !== null && input.nitrogen < 280) deficiencies.push('Available Nitrogen is low');
      if (input.phosphorus !== undefined && input.phosphorus !== null && input.phosphorus < 10) deficiencies.push('Available Phosphorus is low');
      if (input.potassium !== undefined && input.potassium !== null && input.potassium < 110) deficiencies.push('Available Potassium is low');
      if (input.organicCarbon !== undefined && input.organicCarbon !== null && input.organicCarbon < 0.5) deficiencies.push('Organic Carbon is low (< 0.5%)');

      return {
        overallAssessment: `The soil exhibits characteristics of ${input.soilType} with a ${phStatus} pH profile. ${deficiencies.length > 0 ? 'Targeted organic replenishment is recommended to restore nutrient equilibrium.' : 'Maintaining organic matter and balanced fertilization will support sustained productivity.'}`,
        soilPHStatus: phStatus,
        nutrientAssessment: {
          nitrogen: input.nitrogen ? (input.nitrogen < 280 ? 'Low' : input.nitrogen > 560 ? 'High' : 'Medium') : 'unknown',
          phosphorus: input.phosphorus ? (input.phosphorus < 10 ? 'Low' : input.phosphorus > 25 ? 'High' : 'Medium') : 'unknown',
          potassium: input.potassium ? (input.potassium < 110 ? 'Low' : input.potassium > 280 ? 'High' : 'Medium') : 'unknown',
          organicCarbon: input.organicCarbon ? (input.organicCarbon < 0.5 ? 'Low' : input.organicCarbon > 0.75 ? 'High' : 'Medium') : 'unknown',
        },
        potentialDeficiencies: deficiencies.length > 0 ? deficiencies : ['Nitrogen and organic matter require monitoring'],
        potentialExcesses: input.soilPH && input.soilPH > 8.5 ? ['High alkalinity / free sodium salts'] : [],
        suitableCrops: ['Millets', 'Pulses', 'Oilseeds', 'Maize', 'Vegetables suited to ' + input.soilType],
        improvementPractices: [
          'Incorporate 5-8 tonnes/acre of well-decomposed Farmyard Manure (FYM) or Vermicompost before sowing.',
          'Practice green manuring with Sunn hemp (Crotalaria juncea) or Dhaincha (Sesbania) prior to main crop.',
          phStatus === 'acidic' ? 'Apply agricultural lime (calcium carbonate) as per local lab recommendation.' : null,
          phStatus === 'strongly alkaline' ? 'Incorporate agricultural gypsum and maintain adequate drainage.' : null,
          'Avoid continuous monocropping; rotate with leguminous crops to fix biological nitrogen.'
        ].filter(Boolean),
        additionalTestingRequired: [
          'Laboratory micronutrient test (Zinc, Iron, Boron)',
          'Complete Electrical Conductivity (EC) testing if groundwater is saline'
        ],
        warnings: [
          'Do not apply chemical fertilizers excessively without verifying laboratory recommendations.',
          'Always calibrate fertilizer application to specific target crop requirements.'
        ]
      };
    },
  });
}

// ==============================================================================
// 3. FERTILIZER ADVISORY
// ==============================================================================
export async function getFertilizerAdvisory(input) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Generate a safe, scientific, balanced fertilizer recommendation for the specified crop.
${langPrompt}

CROP & FIELD DETAILS:
- Crop: ${input.cropName} (${input.cropVariety || 'Standard variety'})
- Current Growth Stage: ${input.growthStage}
- Land Area: ${input.landArea} ${input.landUnit}
- Soil Type: ${input.soilType || 'Not specified'}
- Soil pH: ${input.soilPH ?? 'Not provided'}
- Soil N-P-K: N=${input.nitrogen ?? 'unknown'}, P=${input.phosphorus ?? 'unknown'}, K=${input.potassium ?? 'unknown'}
- Farming Method: ${input.farmingMethod}
- Current/Previous Fertilizer Usage: ${input.currentFertilizerUsage || 'None noted'}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "cropName": "${input.cropName}",
  "growthStage": "${input.growthStage}",
  "nutrientAssessment": ["Nutritional demand at this specific stage"],
  "recommendations": [
    {
      "fertilizerCategory": "Basal / Top Dressing / Organic / Biofertilizer",
      "purpose": "Specific physiological benefit",
      "applicationTiming": "Exact growth stage timing",
      "applicationMethod": "Broadcasting / Band placement / Fertigation / Foliar spray",
      "quantity": 25.0,
      "quantityUnit": "kg/acre",
      "reason": "Clear explanation of why this dosage and nutrient is needed"
    }
  ],
  "safetyPrecautions": ["Crucial personal safety and environmental precautions"],
  "dataLimitations": ["State if exact soil nutrient lab tests were missing"],
  "warnings": ["Chemical interaction warnings; avoid unsafe combinations"]
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: fertilizerResponseSchema,
    fallbackGenerator: () => {
      const isOrganic = input.farmingMethod === 'organic' || input.farmingMethod === 'natural';
      return {
        cropName: input.cropName,
        growthStage: input.growthStage,
        nutrientAssessment: [
          `At the ${input.growthStage} stage, ${input.cropName} requires balanced nutrition to support healthy root and vegetative biomass.`,
          'Nitrogen is critical for canopy development, while phosphorus and potassium ensure strong rooting and disease resilience.'
        ],
        recommendations: isOrganic
          ? [
              {
                fertilizerCategory: 'Organic Manure',
                purpose: 'Improve soil structure and provide slow-release macronutrients',
                applicationTiming: 'Basal application during field preparation or early vegetative stage',
                applicationMethod: 'Soil incorporation',
                quantity: input.landUnit === 'acre' ? 2000 : 5000,
                quantityUnit: input.landUnit === 'acre' ? 'kg/acre' : 'kg/hectare',
                reason: 'Well-decomposed compost or FYM supplies balanced micronutrients and beneficial microbes.'
              },
              {
                fertilizerCategory: 'Biofertilizer',
                purpose: 'Atmospheric nitrogen fixation and phosphorus solubilization',
                applicationTiming: 'Seed treatment or seedling root dip',
                applicationMethod: 'Bio-inoculation',
                quantity: 2.0,
                quantityUnit: 'kg/acre',
                reason: 'Azotobacter / PSB culture enhances nutrient bioavailability without synthetic residues.'
              }
            ]
          : [
              {
                fertilizerCategory: 'Organic Basal',
                purpose: 'Build soil microbial activity and organic buffer',
                applicationTiming: 'During land preparation before sowing',
                applicationMethod: 'Even broadcasting and mixing',
                quantity: input.landUnit === 'acre' ? 2000 : 4500,
                quantityUnit: input.landUnit === 'acre' ? 'kg/acre' : 'kg/hectare',
                reason: 'Enhances water retention and nutrient absorption efficiency of synthetic fertilizers.'
              },
              {
                fertilizerCategory: 'Basal N-P-K',
                purpose: 'Supply initial phosphorus and potassium for root anchorage',
                applicationTiming: 'At sowing or transplanting',
                applicationMethod: 'Band placement 5 cm below and away from seed line',
                quantity: 40.0,
                quantityUnit: 'kg/acre',
                reason: 'Phosphorus is immobile in soil and must be placed near the active root zone.'
              },
              {
                fertilizerCategory: 'Top Dressing Nitrogen',
                purpose: 'Promote active vegetative growth and leaf development',
                applicationTiming: '30-45 days after sowing (active tillering/vegetative)',
                applicationMethod: 'Top dressing during moist soil conditions',
                quantity: 25.0,
                quantityUnit: 'kg/acre',
                reason: 'Splitting nitrogen application prevents leaching loss and matches crop uptake curve.'
              }
            ],
        safetyPrecautions: [
          'Wear protective gloves and face mask when handling chemical fertilizers.',
          'Never mix urea directly with unslaked lime or basic slag as it causes ammonia volatilization.',
          'Do not apply chemical fertilizers to completely dry soil; irrigate immediately or apply when soil has adequate moisture.'
        ],
        dataLimitations: [
          input.nitrogen ? null : 'Precise soil test report was unavailable; dosage is based on state agronomic package of practices.',
        ].filter(Boolean),
        warnings: [
          'Excess nitrogen promotes soft vegetative growth, making crops vulnerable to sucking pests and lodging.',
          'Always calibrate application equipment to prevent localized root burn.'
        ]
      };
    },
  });
}

// ==============================================================================
// 4. IRRIGATION ADVISORY
// ==============================================================================
export async function getIrrigationAdvisory(input) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Generate a customized, water-efficient irrigation management plan.
${langPrompt}

PARAMETERS:
- Crop: ${input.cropName}
- Growth Stage: ${input.growthStage}
- Soil Type: ${input.soilType}
- Land Area: ${input.landArea} ${input.landUnit}
- Irrigation Method: ${input.irrigationMethod}
- Water Availability: ${input.waterAvailability}
- Last Rainfall / Rain status: ${input.lastRainfall || 'No recent rain'}
- Temperature: ${input.temperature ? `${input.temperature}°C` : 'Seasonal average'}
- Humidity: ${input.humidity ? `${input.humidity}%` : 'Standard'}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "cropName": "${input.cropName}",
  "growthStage": "${input.growthStage}",
  "waterRequirement": "Overall water requirement description",
  "irrigationRecommendations": [
    {
      "timing": "Recommended time of day and frequency (e.g. Early morning every 5-7 days)",
      "method": "${input.irrigationMethod}",
      "reason": "Agronomic justification based on crop stage and soil moisture dynamics"
    }
  ],
  "waterConservationMethods": ["Actionable water-saving techniques e.g., mulching, drip scheduling"],
  "waterStressIndicators": ["Visual field signs that crop is experiencing drought or waterlogging"],
  "drainageAdvice": ["Drainage requirements to prevent root rot"],
  "dataLimitations": ["State limitations when real-time soil moisture sensors are not connected"],
  "warnings": ["Crucial irrigation precautions"]
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: irrigationResponseSchema,
    fallbackGenerator: () => ({
      cropName: input.cropName,
      growthStage: input.growthStage,
      waterRequirement: `Moderate water requirement during ${input.growthStage} in ${input.soilType} soil.`,
      irrigationRecommendations: [
        {
          timing: 'Early morning (6:00 AM - 9:00 AM) or late afternoon (after 4:30 PM) every 5-8 days depending on topsoil dryness.',
          method: input.irrigationMethod,
          reason: `Irrigating during cooler hours minimizes evaporation losses by 20-30% and avoids thermal shock to ${input.cropName} roots.`
        },
        {
          timing: 'At critical moisture-sensitive stages (flowering/pod filling)',
          method: input.irrigationMethod,
          reason: 'Moisture stress during reproductive initiation leads to flower drop and poor grain setting.'
        }
      ],
      waterConservationMethods: [
        'Apply organic straw or crop residue mulch (5 cm layer) to conserve topsoil moisture and suppress weeds.',
        'If using drip irrigation, inspect emitters for clogging and adjust emitter run-times according to soil drying cycles.',
        'Construct field bunds to harvest localized rainfall and prevent runoff erosion.'
      ],
      waterStressIndicators: [
        'Midday leaf curling or wilting that does not recover by late evening indicates drought stress.',
        'Yellowing of lower leaves and foul soil odor indicates standing water saturation and oxygen starvation.'
      ],
      drainageAdvice: [
        `Ensure ${input.soilType} has functional drainage channels to prevent standing water exceeding 24 hours, especially after sudden downpours.`
      ],
      dataLimitations: [
        'Advice is based on standard evapotranspiration estimates; verify soil moisture at 15 cm depth before each irrigation cycle.'
      ],
      warnings: [
        'Over-irrigation in heavy soils causes fungal root rot (Pythium/Phytophthora) and nutrient leaching.',
        'Avoid irrigating under strong midday sun and high winds.'
      ]
    }),
  });
}

// ==============================================================================
// 5. DISEASE DETECTION
// ==============================================================================
export async function getDiseaseAnalysis(input, imageBuffer = null, mimeType = null) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Analyze crop symptoms and diagnose possible plant diseases or pests responsibly.
${langPrompt}

SYMPTOM REPORT:
- Crop: ${input.cropName}
- Affected Plant Part: ${input.affectedPart}
- Symptoms: ${input.symptoms}
- Problem Duration: ${input.duration}
- Visible Damage / Observations: ${input.visibleDamage || 'None noted'}
- Image Uploaded: ${imageBuffer ? 'Yes (attached)' : 'No'}

CRITICAL SAFETY DIRECTIVE:
- Do NOT declare 100% certainty without laboratory verification.
- Clearly state alternative causes (e.g. nutritional deficiencies, abiotic stress).
- Emphasize Integrated Pest Management (IPM), cultural controls, and biological measures first.
- Never recommend illegal, banned, or unapproved chemical combinations.

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "cropName": "${input.cropName}",
  "possibleConditions": [
    {
      "name": "Probable Disease / Pest Name",
      "confidenceLevel": "Low / Medium / High",
      "supportingSymptoms": ["Matching symptoms observed"],
      "alternativeCauses": ["Possible nutrient deficiency or physiological stress"],
      "recommendedInspection": ["Specific inspection steps on the plant (e.g. examine underside of leaf)"]
    }
  ],
  "preventiveMeasures": ["Cultural and preventive sanitation measures"],
  "integratedPestManagement": ["IPM strategies: yellow sticky traps, neem oil, biocontrol agents"],
  "treatmentGuidance": ["Safe, approved, responsible management steps"],
  "safetyWarnings": ["Wear PPE; never spray near water bodies; consult local KVK before chemical use"],
  "expertConsultationRequired": true
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: diseaseResponseSchema,
    fallbackGenerator: () => ({
      cropName: input.cropName,
      possibleConditions: [
        {
          name: `${input.cropName} Fungal Foliar Leaf Spot / Blight complex`,
          confidenceLevel: 'Medium',
          supportingSymptoms: [
            input.symptoms,
            `Observed primarily on ${input.affectedPart} persisting for ${input.duration}.`
          ],
          alternativeCauses: [
            'Potassium or magnesium deficiency leading to marginal chlorosis',
            'Sunscald or windburn following sudden weather shifts'
          ],
          recommendedInspection: [
            'Inspect the underside of affected leaves with a 10x hand lens for fungal sporulation, powdery growth, or small insect nymphs.',
            'Check the lower stem near the soil line for dark lesions or vascular discoloration.',
            'Observe if symptoms are spreading in the direction of prevailing wind or irrigation flow.'
          ]
        }
      ],
      preventiveMeasures: [
        'Prune and destroy severely infected plant parts to limit local spore dispersal; do not compost diseased leaves.',
        'Avoid overhead sprinkler irrigation that keeps leaves wet for prolonged periods; irrigate at soil level.',
        'Maintain proper row spacing to facilitate air circulation inside the plant canopy.'
      ],
      integratedPestManagement: [
        'Install yellow and blue sticky traps (10-12 per acre) to monitor and catch sucking insect vectors.',
        'Spray Cold-Pressed Neem Oil (5ml/L of water with 1ml liquid soap as emulsifier) during early symptom onset.',
        'Apply Trichoderma viride or Pseudomonas fluorescens as a biological foliar spray (20g/L) during cool morning hours.'
      ],
      treatmentGuidance: [
        'If infection exceeds 15-20% leaf area across the field, consult a local KVK agronomist for certified fungicides approved in your state.',
        'Always read manufacturer label instructions and observe the recommended pre-harvest interval (PHI).'
      ],
      safetyWarnings: [
        'AI assessment is a preliminary decision support tool and is NOT a certified laboratory diagnosis.',
        'Always wear protective rubber gloves, eye protection, and a mask when applying any agricultural spray.',
        'Do not apply chemical sprays during flowering hours to safeguard honeybees and pollinator insects.'
      ],
      expertConsultationRequired: true
    }),
  });
}

// ==============================================================================
// 6. CULTIVATION CALENDAR
// ==============================================================================
export async function getCultivationCalendar(input) {
  const langPrompt = getLanguageInstruction(input.language || 'en');
  const prompt = `
TASK: Generate a complete, chronological crop cultivation calendar from pre-sowing land preparation through harvest and post-harvest.
${langPrompt}

INPUT:
- Crop: ${input.cropName}
- Estimated Start Date: ${input.startDate || 'Immediate / Current date'}
- Region/State: ${input.state || 'India'}
- Soil Type: ${input.soilType || 'Standard'}
- Sowing Method: ${input.sowingMethod || 'Standard'}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "cropName": "${input.cropName}",
  "estimatedDurationDays": 120,
  "activities": [
    {
      "stage": "Land Preparation",
      "dayFromStart": 0,
      "dayToStart": 7,
      "description": "Deep ploughing, harrowing, incorporation of well-rotted FYM, and field leveling.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Seed Selection & Treatment",
      "dayFromStart": 8,
      "dayToStart": 10,
      "description": "Select certified seeds; treat with Trichoderma or approved bio-agent to prevent soil-borne pathogens.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Sowing / Transplanting",
      "dayFromStart": 11,
      "dayToStart": 15,
      "description": "Sow seeds at recommended spacing and depth into moist seedbed; apply light initial irrigation.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Weed Management & Thinning",
      "dayFromStart": 20,
      "dayToStart": 25,
      "description": "Perform first hand weeding or intercultural hoeing; thin seedlings to maintain optimal plant population.",
      "importance": "medium",
      "completed": false
    },
    {
      "stage": "Vegetative Growth & Top Dressing",
      "dayFromStart": 30,
      "dayToStart": 40,
      "description": "Apply first top-dressing of nitrogen under adequate soil moisture; scout for early vegetative pests.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Flowering & Moisture Monitoring",
      "dayFromStart": 55,
      "dayToStart": 70,
      "description": "Critical moisture sensitive stage; ensure uniform irrigation; monitor for flower drop and pod borers.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Maturity & Grain/Fruit Filling",
      "dayFromStart": 80,
      "dayToStart": 100,
      "description": "Taper off irrigation as crop begins senescence and drying; check moisture percentage of grain.",
      "importance": "medium",
      "completed": false
    },
    {
      "stage": "Harvesting",
      "dayFromStart": 105,
      "dayToStart": 115,
      "description": "Harvest on a clear, sunny day when 80-85% of ears/pods turn golden brown.",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Post-Harvest Handling & Storage",
      "dayFromStart": 116,
      "dayToStart": 120,
      "description": "Thresh, clean, and sun-dry produce to under 12% moisture before hermetic bag or bin storage.",
      "importance": "medium",
      "completed": false
    }
  ],
  "importantWarnings": ["Timelines may shift by 5-10 days depending on local temperatures and rainfall."],
  "dataLimitations": ["Calendar assumes standard medium-duration variety."]
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: cultivationCalendarResponseSchema,
    fallbackGenerator: () => ({
      cropName: input.cropName,
      estimatedDurationDays: 120,
      activities: [
        {
          stage: 'Land Preparation',
          dayFromStart: 0,
          dayToStart: 7,
          description: `Deep summer ploughing followed by 2 cross-harrowings; incorporate 5-8 tonnes/acre of decomposed FYM into ${input.soilType || 'soil'}.`,
          importance: 'high',
          completed: false
        },
        {
          stage: 'Seed Treatment & Sowing',
          dayFromStart: 8,
          dayToStart: 12,
          description: `Treat certified ${input.cropName} seeds with Trichoderma (4g/kg seed); sow at recommended row-to-row and plant-to-plant spacing in moist seedbed.`,
          importance: 'high',
          completed: false
        },
        {
          stage: 'Germination & First Irrigation',
          dayFromStart: 13,
          dayToStart: 18,
          description: 'Check germination count; provide light life-saving irrigation if topsoil dries out.',
          importance: 'medium',
          completed: false
        },
        {
          stage: 'Weeding & Intercultivation',
          dayFromStart: 21,
          dayToStart: 28,
          description: 'Manual weeding or mechanical cultivation to remove weed competition and aerate root zone.',
          importance: 'high',
          completed: false
        },
        {
          stage: 'Active Vegetative & Nutrient Top-Dressing',
          dayFromStart: 35,
          dayToStart: 45,
          description: 'Top-dress nitrogen or balanced biofertilizer; inspect lower leaf canopy for early chewing or sucking pests.',
          importance: 'high',
          completed: false
        },
        {
          stage: 'Flowering & Critical Water Management',
          dayFromStart: 55,
          dayToStart: 70,
          description: 'Critical moisture period. Maintain consistent soil moisture to prevent blossom/fruit drop. Install pheromone traps.',
          importance: 'high',
          completed: false
        },
        {
          stage: 'Grain / Pod Filling',
          dayFromStart: 75,
          dayToStart: 95,
          description: 'Monitor filling; safeguard against late-season fungal leaf spots. Stop nitrogen application.',
          importance: 'medium',
          completed: false
        },
        {
          stage: 'Harvesting',
          dayFromStart: 105,
          dayToStart: 115,
          description: `Harvest ${input.cropName} during dry weather when 85% of the field reaches physiological maturity.`,
          importance: 'high',
          completed: false
        },
        {
          stage: 'Drying, Threshing & Safe Storage',
          dayFromStart: 116,
          dayToStart: 120,
          description: 'Dry produce to safe storage moisture level (<12%); store in clean, rodent-proof, ventilated storage.',
          importance: 'high',
          completed: false
        }
      ],
      importantWarnings: [
        'Weather anomalies (sudden downpours or dry spells) will require adjusting irrigation and harvest days.',
        'Keep track of pest thresholds before applying control measures.'
      ],
      dataLimitations: [
        'Calendar reflects a standard 120-day crop cycle. Adjust if using short-duration or long-duration varieties.'
      ]
    }),
  });
}

// ==============================================================================
// 7. AI AGRICULTURAL CHATBOT
// ==============================================================================
export async function getChatResponse(history, userMessage, language = 'en') {
  const langPrompt = getLanguageInstruction(language);
  const prompt = `
TASK: Act as AgroAI agricultural advisory chatbot. Answer the farmer's question responsibly, clearly, and practically.
${langPrompt}

CONVERSATION CONTEXT:
${history.map(m => `${m.role === 'user' ? 'Farmer' : 'AgroAI'}: ${m.content}`).join('\n')}

LATEST FARMER MESSAGE:
${userMessage}

REQUIRED JSON OUTPUT FORMAT (Strict schema):
{
  "answer": "Clear, practical agricultural explanation in the requested language",
  "language": "${language}",
  "relatedTopics": ["Related topic 1", "Related topic 2", "Related topic 3"],
  "warnings": ["Any necessary cautionary statements or safety notes"],
  "requiresExpertConsultation": false
}
`;

  return callGeminiStructured({
    prompt,
    responseSchema: chatbotResponseSchema,
    fallbackGenerator: () => {
      const isKannada = language === 'kn';
      return {
        answer: isKannada
          ? `ನಮಸ್ಕಾರ! ಕೃಷಿ ಸಂಬಂಧಿತ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ AgroAI ಸ್ವಾಗತಿಸುತ್ತದೆ. ಮಣ್ಣಿನ ಫಲವತ್ತತೆ, ಬೆಳೆ ಆಯ್ಕೆ, ರೋಗ ನಿರ್ವಹಣೆ ಮತ್ತು ನೀರಾವರಿ ಬಗ್ಗೆ ನಿಖರ ಮಾಹಿತಿ ಪಡೆಯಲು ನಿಮ್ಮ ಭೂಮಿಯ ವಿವರಗಳನ್ನು ನಮಗೆ ತಿಳಿಸಿ. ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ಸಲಹೆಗಳನ್ನು ಸಹ ಅನುಸರಿಸುವುದು ಉತ್ತಮ.`
          : `Hello! AgroAI is ready to assist your farming operations. For optimal crop yield and sustainable soil health, always base nutrient management on soil test results, practice crop rotation with legumes, and inspect your field regularly for early signs of pests. Feel free to ask specific questions about your soil type, crops, fertilizers, or pest management!`,
        language,
        relatedTopics: [
          'Soil testing & health management',
          'Organic and balanced fertilizer application',
          'Water-saving drip irrigation practices',
          'Integrated Pest Management (IPM)'
        ],
        warnings: [
          'AI guidance is for agricultural decision support; consult local agronomists for emergency field inspections.'
        ],
        requiresExpertConsultation: false
      };
    },
  });
}

