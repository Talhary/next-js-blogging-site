'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';

interface GenDallEParams {
    text: string;
    height?: number;
    width?: number;
    model?: string;
    count?: number;
}

interface ImageResponse {
    id: string;
    attrs: {
        src: string;
        meta: {
            width: number;
            height: number;
        };
        aiParams: {
            model: string;
            width: number;
            height: number;
            prompt: string;
        };
    };
}

const generateImage = async (params: GenDallEParams): Promise<ImageResponse[]> => {
    const res = await fetch('/api/gen/image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
};

export default function Home() {
    const [text, setText] = useState<string>('');
    const [height, setHeight] = useState<number>(1024);
    const [width, setWidth] = useState<number>(1024);
    const [model, setModel] = useState<string>('dall-e-3');
    const [count, setCount] = useState<number>(1);
    const [images, setImages] = useState<ImageResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await generateImage({ text, height, width, model, count });
            console.log(response)
            setImages(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDimensionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const [newHeight, newWidth] = e.target.value.split('x').map(Number);
        setHeight(newHeight);
        setWidth(newWidth);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Generate Images</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Prompt:</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your image description..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Model:</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="dall-e-3">DALL-E 3</option>
                        <option value="flux-1-pro">Flux-1-Pro</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dimensions:</label>
                    <select
                        onChange={handleDimensionsChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {model === 'dall-e-3' && <div>
                            <option value="1024x1024">Square (1024 x 1024)</option>
                            <option value="1792x1024">Landscape (1792 x 1024)</option>
                            <option value="1024x1792">Portrait (1024 x 1792)</option>

                        </div>}
                        {model === 'flux-1-pro' && <option value="1440x1440">Square (1440 x 1440)</option>}
                        {model === 'flux-1-pro' && <option value="960x1440">Portrait (960 x 1440)</option>}
                        {model === 'flux-1-pro' && <option value="1440x960">Landscape (1440 x 960)</option>}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Count:</label>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        min="1"
                        max="3"
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate'}
                </button>
            </form>

            {isLoading && (
                <div className="mt-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Generating your images...</p>
                </div>
            )}

            {images.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">Generated Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image) => (
                            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-64">
                                    <Image
                                        src={image.attrs.src}
                                        alt="Generated"
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg'; // Add a placeholder image
                                        }}
                                    />
                                </div>
                                <div className="p-4 space-y-2">
                                    <p className="text-sm"><span className="font-medium">Prompt:</span> {image.attrs.aiParams.prompt}</p>
                                    <p className="text-sm"><span className="font-medium">Model:</span> {image.attrs.aiParams.model}</p>
                                    <p className="text-sm"><span className="font-medium">Dimensions:</span> {image.attrs.aiParams.width}x{image.attrs.aiParams.height}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
