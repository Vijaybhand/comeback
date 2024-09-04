import React, { useState } from 'react';

interface ResponseData {
  content: Array<{ text: string }>;
}

function YourComponent() {
    const [responseData, setResponseData] = useState<ResponseData | null>(null);

    const handleGenerateComeback = async () => {
        await generateComeback(setResponseData);
    };

    return (
        <div>
            <button onClick={handleGenerateComeback}>Generate Comeback</button>
            {responseData && responseData.content && responseData.content[0] && (
                <div>
                    <h3>Response:</h3>
                    <p>{responseData.content[0].text}</p>
                </div>
            )}
        </div>
    );
}

export default YourComponent;