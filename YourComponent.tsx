import React, { useState } from 'react';

interface ResponseData {
  content: Array<{ text: string }>;
}

function YourComponent() {
    const [responseData, setResponseData] = useState<ResponseData | null>(null);

    const handleGenerateComeback = async () => {
        // Ensure generateComeback is properly imported and typed
        await generateComeback(setResponseData);
    };

    return (
        <div>
            <button onClick={handleGenerateComeback}>Generate Comeback</button>
            {responseData?.content?.[0]?.text && (
                <div>
                    <h3>Response:</h3>
                    <p>{responseData.content[0].text}</p>
                </div>
            )}
        </div>
    );
}

export default YourComponent;