const handleApiResponse = async (response: Response) => {
    const data = await response.json();
    console.log("API response:", data);

    if (response.ok) {
        const comeback = data.content[0]?.text;
        if (comeback) {
            setGeneratedComeback(comeback);
        } else {
            setError("Failed to generate comeback. Please try again.");
        }
    } else {
        setError("Failed to generate comeback. Please try again.");
    }
};

const generateComeback = async () => {
    try {
        const response = await fetch('/api/generate-comeback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userPrompt }),
        });
        await handleApiResponse(response);
    } catch (error) {
        console.error("Error generating comeback:", error);
        setError("Failed to generate comeback. Please try again.");
    }
};