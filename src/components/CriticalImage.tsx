interface CriticalImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const CriticalImage = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height
}: CriticalImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="eager"
      decoding="sync"
      fetchPriority="high"
    />
  );
};

export default CriticalImage;