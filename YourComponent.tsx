import React, { useState } from 'react';

interface ResponseData {
  content: Array<{ text: string }>;
}

function YourComponent() {
    const [responseData, setResponseData] = useState<ResponseData | null>(null);

    // Call generateComeback and pass setResponseData as a callback
    const handleGenerateComeback = async () => {
        await generateComeback(setResponseData);
    };

    return (
        <div>
            <button onClick={handleGenerateComeback}>Generate Comeback</button>
            {responseData && (
                <div>
                    <h3>Response:</h3>
                    <p>{responseData.content[0]?.text ?? 'No response available'}</p>
                </div>
            )}
        </div>
    );
}

export default YourComponent;