export interface GenDallEParams {
  text: string;
  height?: number;
  width?: number;
  model?: 'flux-1-pro' | 'dall-e-3' | 'flux-1-schnell';
  count?: number;
}

export interface ImageResponse {
  code?:string,
  message?:string,
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

