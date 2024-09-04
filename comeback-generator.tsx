interface Message {
    role: string;
    content: string;
}

export async function generateComebackAPI(messages: Message[]): Promise<any> {
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
        console.log('API Response Data:', data);
        return data;
    } catch (error) {
        console.error('Error generating comeback:', error);
        throw error;
    }
}

// Function to update the UI with the response data
export function updateUIWithResponse(data: any): void {
    // This function is not used in the current context
    // If you need to use it, you should implement it in your React component
    console.warn('updateUIWithResponse is not implemented');
}