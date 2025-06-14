import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapboxMapProps {
  latitude?: number;
  longitude?: number;
  className?: string;
}

const MapboxMap = ({ 
  latitude = -15.2293, 
  longitude = -59.3559, 
  className = "w-full h-80" 
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [longitude, latitude],
        zoom: 14,
        pitch: 45,
      });

      // Add marker for business location
      new mapboxgl.Marker({
        color: 'hsl(var(--brand-gold))',
        scale: 1.2
      })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML('<div class="text-center p-2"><strong>MK Tecnologia</strong><br/>Av Marechal Rondon, 1512<br/>Pontes e Lacerda/MT</div>')
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setShowTokenInput(false);
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-50 border border-brand-gold/20 rounded-xl`}>
        <div className="text-center p-6 max-w-md">
          <h3 className="text-lg font-semibold text-brand-black mb-4">
            Configure o Mapa
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Para exibir o mapa, insira seu token público do Mapbox. 
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-gold hover:underline ml-1"
            >
              Obtenha aqui
            </a>
          </p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="border-brand-gold/20 focus:border-brand-gold"
            />
            <Button 
              onClick={initializeMap}
              disabled={!mapboxToken}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark text-brand-black"
            >
              Carregar Mapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden border border-brand-gold/20 shadow-lg`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapboxMap;