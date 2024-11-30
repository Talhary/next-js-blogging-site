'use client';

import { ChangeEvent, FormEvent, useEffect, useState,useRef } from 'react';
// import Image from 'next/image';
import { GenDallEParams, ImageResponse } from '../types/gen-image';
import ReCAPTCHA from "react-google-recaptcha";



export default function ImageGenerator() {
  const generateImage = async (params: GenDallEParams, token: string) => {
    try {

      if (!token) {
        throw new Error("Failed to generate reCAPTCHA token.");
      }

      const res = await fetch('/api/gen/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, captcha: token }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("Error in generateImage:", err);
      throw err; // Propagate the error for further handling.
    }
  };

  const recaptchaRef:any = useRef();
  const [formData, setFormData] = useState<GenDallEParams>({
    text: '',
    height: 1440,
    width: 1440,
    model: 'flux-1-pro',
    count: 3,
  });
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oldImages, setOldImages] = useState<ImageResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('')

  useEffect(() => {
    // Load old images from local storage when the component mounts
    const storedImages = localStorage.getItem('oldImages');
    if (storedImages) {
      setOldImages(JSON.parse(storedImages));
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'model') {
      let newDimensions;
      switch (value) {
        case 'dall-e-3':
          newDimensions = { width: 1024, height: 1024 };
          break;
        case 'flux-1-schnell':
          newDimensions = { width: 1024, height: 1024 };
          break;
        case 'flux-1-ultra':
          newDimensions = { width: 2048, height: 2048 };
          break;
        default: // flux-1-pro
          newDimensions = { width: 1440, height: 1440 };
      }
      setFormData(prev => ({ ...prev, ...newDimensions }));
    }
  };

  const handleDimensionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [newHeight, newWidth] = e.target.value.split('x').map(Number);
    setFormData(prev => ({ ...prev, height: newHeight, width: newWidth }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // console.log(token)
    if (!token) {
      setIsLoading(false);
      return setError('Failed To Get Captcha Please Reload')
    }
    try {
      const response = await generateImage(formData, token);
      if (response?.code) {
        return setError(response.message)
      }
      if (response?.err) {
        return setError(response.msg)

      }
      recaptchaRef?.current?.reset();
      setImages(response);

      // Store the new images in local storage
      const updatedOldImages = [...oldImages, ...response];
      setOldImages(updatedOldImages);
      localStorage.setItem('oldImages', JSON.stringify(updatedOldImages));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };
  const clearOldImages = () => {
    setOldImages([]);
    localStorage.removeItem('oldImages');
  };
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Generate Images</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <FormField
          label="Prompt:"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Enter your image description..."
        />

        <FormField
          label="Model:"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          disabled={isLoading}
          as="select"
        >
          <option value="dall-e-3">DALL E 3</option>
          <option value="flux-1-pro">Flux Pro</option>
          <option value="flux-1-ultra">Flux Ultra</option>
          <option value="flux-1-schnell">Flux Schnell</option>
        </FormField>

        <FormField
          label="Dimensions:"
          name="dimensions"
          value={`${formData.height}x${formData.width}`}
          onChange={handleDimensionsChange}
          disabled={isLoading}
          as="select"
        >
          {formData.model === 'dall-e-3' && (
            <>
              <option value="1024x1024">Square </option>
              <option value="1792x1024">Portrait </option>
              <option value="1024x1792">Landscape</option>
            </>
          )}
          {formData.model === 'flux-1-pro' && (
            <>
              <option value="1440x1440">Square </option>
              <option value="960x1440">Landscape </option>
              <option value="1440x960">Portrait </option>
            </>
          )}
          {formData.model === 'flux-1-schnell' && (
            <>
              <option value="1024x1024">Square </option>
              <option value="1152x896">Portrait </option>
              <option value="896x1152">Landscape </option>
            </>
          )}
          {formData.model === "flux-1-ultra" && (
            <>
              <option value="2048x2048">Square </option>
              <option value="2752x1536">Portrait </option>
              <option value="1536x2752">Landscape</option>
            </>
          )}
        </FormField>
        <FormField
          label="Count:"
          name="count"
          value={formData.count}
          onChange={handleInputChange}
          disabled={isLoading}
          type="number"
          min={1}
          max={3}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Generating...
            </>
          ) : 'Generate'}
        </button>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LcehI4qAAAAABOwY-yqdJ4Y5EvT6Nze-4lH6AmI"
          onChange={(value: string) => setToken(value)}
        />
      </form>

      {isLoading && <LoadingIndicator />}

      {images.length > 0 && (
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-6 text-center">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}

      {oldImages.length > 0 && (
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-6 text-center">Old Images</h2>
          <button
            onClick={clearOldImages}
            className="mb-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Clear Old Images
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {oldImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}
    </div>

  );
}

function FormField({ label, as = 'input', children, ...props }: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> & { label: string, as?: 'input' | 'select' }) {
  const Component = as;
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <Component
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600 dark:disabled:bg-gray-700"
      >
        {children}
      </Component>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function LoadingIndicator() {
  return (
    <div className="mt-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent dark:border-blue-400 dark:border-t-transparent"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Generating your images...</p>
    </div>
  );
}

function ImageCard({ image }: { image: ImageResponse }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div
        className="relative w-full"

      >
        <img
          src={image.attrs.src}
          alt="Generated"

          className="w-full h-full object-fill"
        // Ensure lazy loading is enabled

        />
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm dark:text-gray-300">
          <span className="font-medium">Prompt:</span> {image.attrs.aiParams.prompt}
        </p>
        <p className="text-sm dark:text-gray-300">
          <span className="font-medium">Model:</span> {image.attrs.aiParams.model}
        </p>
        <p className="text-sm dark:text-gray-300">
          <span className="font-medium">Dimensions:</span> {image.attrs.aiParams.width}x{image.attrs.aiParams.height}
        </p>
      </div>
    </div>
  );
}
