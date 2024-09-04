import React, { useState } from 'react';
import generateComebackAPI from './comeback-generator';

interface ResponseData {
  content: Array<{ text: string }>;
}

interface ComebackData {
  content: Array<{ text: string }>;
}

const ComebackGenerator: React.FC = () => {
    const [generatedComeback, setGeneratedComeback] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [insult, setInsult] = useState<string>('');
    const [responseData, setResponseData] = useState<ResponseData | null>(null);
    const [copied, setCopied] = useState(false);

    const generateComeback = async (insult: string) => {
        try {
            const messages = [
                { role: "user", content: insult }
            ];
            const data = await generateComebackAPI(messages);
            
            if (typeof data === 'string') {
                setGeneratedComeback(data);
                setResponseData({ content: [{ text: data }] });
            } else if (isComebackData(data)) {
                setGeneratedComeback(data.content[0].text);
                setResponseData(data);
            } else {
                setError("Failed to generate comeback. Please try again.");
                setResponseData(null);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            setResponseData(null);
            console.error('Error:', error);
        }
    };

    function isComebackData(data: any): data is ComebackData {
        return (
            typeof data === 'object' &&
            data !== null &&
            Array.isArray(data.content) &&
            data.content.length > 0 &&
            typeof data.content[0].text === 'string'
        );
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedComeback);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div>
            <input
                type="text"
                value={insult}
                onChange={(e) => setInsult(e.target.value)}
                placeholder="Enter an insult"
            />
            <button onClick={() => generateComeback(insult)}>Generate Comeback</button>
            {generatedComeback && (
                <>
                    <p>Comeback: {generatedComeback}</p>
                    <button onClick={copyToClipboard}>
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ComebackGenerator;