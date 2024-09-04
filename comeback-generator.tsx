async function generateComeback(messages) {
    try {
        const response = await fetch('/api/claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response Data:', data); // Log the response data
        return data;
    } catch (error) {
        console.error('Error generating comeback:', error); // Log the error
        throw error;
    }
}

// Function to update the UI with the response data
function updateUIWithResponse(data) {
    // Assuming you have a state or a method to update the UI
    // For example, if using React state:
    setResponseData(data);
}