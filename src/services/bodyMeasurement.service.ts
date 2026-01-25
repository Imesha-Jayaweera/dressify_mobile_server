import {analyzeBodyImage, BodyMeasurementInput} from "../data-access/bodyMeasurement.repo";
export const getBodyMeasurements = async (input: BodyMeasurementInput) => {
    try {
        // Validate image data exists
        if (!input.imageBase64) {
            throw new Error("Image data is required");
        }

        const cleanBase64 = input.imageBase64.trim();

        // Check format
        const isDataUrl = cleanBase64.startsWith("data:image/");
        const isRawBase64 = /^[A-Za-z0-9+/]+=*$/.test(cleanBase64.substring(0, 200));

        if (!isDataUrl && !isRawBase64) {
            throw new Error(`Invalid image format`);
        }

        console.log("Calling analyzeBodyImage...");
        const result = await analyzeBodyImage(input);

        // Log raw AI response for debugging
        console.log("AI raw response:", result.choices?.[0]?.message?.content);

        // OpenAI returns the content directly as a string when using json_schema
        const content = result.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("AI did not return body measurement data");
        }

        // The content is already a JSON string, parse it directly
        let data;
        if (typeof content === 'string') {
            // It's a string, parse it
            data = JSON.parse(content);
        } else {
            // It's already an object
            data = content;
        }

        console.log("Parsed data:", data);
        return data;

    } catch (error: any) {
        console.error("Body Measurement Service Error:", error);
        throw new Error(error.message || "Failed to analyze body image.");
    }
};





