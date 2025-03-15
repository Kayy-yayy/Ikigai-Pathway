declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
  
  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
  }
  
  const Image: React.FC<ImageProps>;
  export default Image;
}
