import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

const GRADE_COLORS = { A: '#10b981', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

export function MapboxSinglePin({ restaurant, small }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!restaurant?.geometry?.coordinates?.length) return;
    const [lng, lat] = restaurant.geometry.coordinates;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 14,
    });

    const el = document.createElement('div');
    el.style.cssText = `
      width: 14px; height: 14px; border-radius: 50%;
      background: ${GRADE_COLORS[restaurant.hygieneGrade] || '#00d4aa'};
      border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.2);
    `;

    new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapRef.current);
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => mapRef.current?.remove();
  }, [restaurant]);

  return <div ref={containerRef} className={`map-container ${small ? 'map-container-sm' : ''}`} />;
}

export function MapboxMultiPin({ restaurants }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!restaurants?.length) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716],
      zoom: 11,
    });

    restaurants.forEach((r) => {
      if (!r.geometry?.coordinates?.length) return;
      const [lng, lat] = r.geometry.coordinates;
      const el = document.createElement('div');
      el.style.cssText = `
        width: 12px; height: 12px; border-radius: 50%;
        background: ${GRADE_COLORS[r.hygieneGrade] || '#8b9cbf'};
        border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15);
        cursor: pointer; transition: transform 0.2s ease;
      `;
      el.title = r.name;
      el.onmouseover = () => { el.style.transform = 'scale(1.2)'; };
      el.onmouseout = () => { el.style.transform = 'scale(1)'; };
      el.onclick = () => { window.location.href = `/restaurants/${r._id}`; };

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
          `<div style="font-family:Outfit,sans-serif;padding:4px 2px">
            <strong style="font-size:13px">${r.name}</strong><br/>
            <span style="font-size:11px;color:#64748b">Score: ${r.hygieneScore}/100 · Grade ${r.hygieneGrade}</span>
          </div>`
        ))
        .addTo(mapRef.current);
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    return () => mapRef.current?.remove();
  }, [restaurants]);

  return <div ref={containerRef} className="map-container" />;
}
