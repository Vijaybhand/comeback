import React, { useState } from 'react';

interface ResponseData {
  content: Array<{ text: string }>;
}

const generateComeback = async (setComeback: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await fetch('/api/generate-comeback');
  const data = await response.json();
  setComeback(data.comeback);
};

function YourComponent() {
    const [responseData, setResponseData] = useState<ResponseData | null>(null);
    const [comeback, setComeback] = useState<string>("");

    const handleGenerateComeback = async () => {
        await generateComeback(setComeback);
    };

    return (
        <div>
            <button onClick={handleGenerateComeback}>Generate Comeback</button>
            {comeback && (
                <div>
                    <h3>Response:</h3>
                    <p>{comeback}</p>
                </div>
            )}
        </div>
    );
}

export default YourComponent;