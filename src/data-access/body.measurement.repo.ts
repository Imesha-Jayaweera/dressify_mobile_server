import {openai} from "../util/openRouterClient";

export interface BodyMeasurementInput {
    imageBase64: string;
}

export const analyzeBodyImage = async (input: BodyMeasurementInput) => {
    let imageDataUrl: string;
    const cleanBase64 = input.imageBase64.trim();

    if (cleanBase64.startsWith("data:image/")) {
        imageDataUrl = cleanBase64;
    } else {
        console.log("Converting raw base64 to data URL");
        imageDataUrl = `data:image/jpeg;base64,${cleanBase64}`;
    }

    console.log("Sending to OpenAI with data URL format:", imageDataUrl.substring(0, 50) + "...");


    const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        "text": "You are an AI assistant specialized in analyzing images of people to extract physical characteristics. Your task is to identify and classify the following attributes based on visual information:\n\n1. **Gender**: Determine the apparent gender presentation as either \"male\" or \"female\" based on visual cues.\n\n2. **Skin Color**: Classify the skin tone using one of these seven categories:\n   - \"very light\" - Very pale skin tones\n   - \"light\" - Fair skin tones\n   - \"light to medium\" - Light skin with slight tan\n   - \"medium\" - Olive or medium beige skin tones\n   - \"tan\" - Noticeably tanned or medium-dark skin\n   - \"dark\" - Dark brown skin tones\n   - \"very dark\" - Very deep brown to black skin tones\n\n3. **Body Type**: Classify based on the person's body shape, using gender-specific categories:\n   \n   **For Women:**\n   - \"round\" - Rounded shape with similar bust, waist, and hip measurements\n   - \"hourglass\" - Defined waist with similar bust and hip measurements\n   - \"inverted-triangle\" - Broader shoulders/bust, narrower hips\n   - \"rectangle\" - Similar measurements throughout, minimal waist definition\n   - \"triangle\" (or pear) - Narrower shoulders/bust, wider hips\n\n   **For Men:**\n   - \"oval\" - Rounded midsection, weight carried in the center\n   - \"rectangle\" - Straight up and down, minimal waist definition\n   - \"trapezoid\" - Broad shoulders tapering to narrower waist\n   - \"inverted trapezoid\" - Narrower shoulders, wider waist/hips\n\n4. **Approximate Height (cm)**: Estimate the person's height in centimeters by using reference objects in the image. Use these methods:\n   - **Known objects**: Compare the person to objects with standard dimensions (doors ~200cm, doorknobs ~100cm, standard chairs ~45cm seat height, tables ~75cm, cars ~150cm height, etc.)\n   - **Body proportions**: Use anatomical proportions (average head height is ~1/7.5 to 1/8 of total body height)\n   - **Perspective analysis**: Account for camera angle and distance\n   - **Environmental context**: Use architectural elements (standard ceiling heights ~240-270cm, stair risers ~18cm, etc.)\n   \n   **Height estimation guidelines:**\n   - If clear reference objects are visible, provide a specific estimate\n   - If only partial references are available, provide a range estimate as the midpoint\n   - If no reliable references exist, use average heights: women ~162cm, men ~175cm, but adjust based on visible proportions\n\n5. **Approximate Width (cm)**: Estimate the person's shoulder width in centimeters using similar reference-based methods:\n   - **Known objects**: Compare shoulder span to objects with standard dimensions\n   - **Body proportions**: Average shoulder width is approximately:\n     - Men: 40-50cm (average ~45cm)\n     - Women: 35-42cm (average ~38cm)\n   - **Reference to height**: Shoulder width is typically 23-25% of total height\n   - **Perspective analysis**: Account for camera angle and body position\n   \n   **Width estimation guidelines:**\n   - Measure from the outermost points of the shoulders (acromion to acromion)\n   - Account for clothing bulk and posture\n   - Consider body type when estimating (broader for trapezoid/inverted-triangle types)\n   - Adjust estimates based on visible reference objects and proportions\n\n**Important Guidelines:**\n- Base your analysis only on visible characteristics in the image\n- Be objective and descriptive, avoiding bias\n- If the image quality is poor or the person is not fully visible, make your best assessment based on available information\n- Focus on body shape structure rather than weight when determining body type\n- For height and width estimation, clearly identify which reference objects you used\n- Account for perspective distortion and camera angles in all measurements\n\nProvide your analysis in the specified JSON format."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: { url: imageDataUrl }
                    }
                ]
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "physical_characteristics",
                strict: false,
                schema: {
                    type: "object",
                    "properties": {
                        "gender": {
                            "type": "string",
                            "enum": [
                                "male",
                                "female"
                            ],
                            "description": "The apparent gender presentation of the person"
                        },
                        "skin_color": {
                            "type": "string",
                            "enum": [
                                "very light",
                                "light",
                                "light to medium",
                                "medium",
                                "tan",
                                "dark",
                                "very dark"
                            ],
                            "description": "The skin tone classification"
                        },
                        "body_type": {
                            "type": "string",
                            "enum": [
                                "round",
                                "hourglass",
                                "inverted-triangle",
                                "rectangle",
                                "triangle",
                                "oval",
                                "trapezoid",
                                "inverted trapezoid"
                            ],
                            "description": "Body shape classification (options vary by gender)"
                        },
                        "height_cm": {
                            "type": "integer",
                            "minimum": 140,
                            "maximum": 220,
                            "description": "Estimated height in centimeters based on reference objects and proportions"
                        },
                        "width_cm": {
                            "type": "integer",
                            "minimum": 30,
                            "maximum": 60,
                            "description": "Estimated shoulder width in centimeters based on reference objects and proportions"
                        },
                        "measurement_metadata": {
                            "type": "object",
                            "properties": {
                                "height_confidence": {
                                    "type": "string",
                                    "enum": [
                                        "high",
                                        "medium",
                                        "low"
                                    ],
                                    "description": "Confidence level of the height estimation"
                                },
                                "width_confidence": {
                                    "type": "string",
                                    "enum": [
                                        "high",
                                        "medium",
                                        "low"
                                    ],
                                    "description": "Confidence level of the width estimation"
                                },
                                "reference_objects": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "List of reference objects used for measurements"
                                },
                                "reasoning": {
                                    "type": "string",
                                    "description": "Brief explanation of how the measurements were estimated"
                                }
                            },
                            "required": [
                                "height_confidence",
                                "width_confidence",
                                "reference_objects",
                                "reasoning"
                            ],
                            "additionalProperties": false
                        }
                    },

                    required: ["gender", "skin_color", "body_type", "height_cm", "width_cm", "measurement_metadata"],
                    additionalProperties: false
                }
            }
        },
        temperature: 0,
        max_completion_tokens: 2048,
    });

    return response;
};
