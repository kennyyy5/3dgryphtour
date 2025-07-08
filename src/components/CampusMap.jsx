"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CampusMapWithPanel() {
  const mapRef = useRef(null);
  const [destination, setDestination] = useState("");
  const [walkingTime, setWalkingTime] = useState(null);

  const directionsRendererRef = useRef(null);
  const mapInstanceRef = useRef(null); // Store actual map

  
const [events, setEvents] = useState([]);
useEffect(() => {
  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data.events)

  };

  

  fetchEvents();
  const interval = setInterval(fetchEvents, 5 * 60 * 1000);
return () => clearInterval(interval);
}, []);

  const geocodeLocation = async (location) => {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(location)}`);
    const data = await res.json();

    if (data.status !== "OK" || data.results.length === 0) {
      alert("Geocoding failed: " + data.status);
      return null;
    }

    return data.results[0].geometry.location;
  };

  const estimateWalkingTime = async (origin, destinationCoords) => {
    const service = new google.maps.DistanceMatrixService();
  
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destinationCoords],
        travelMode: google.maps.TravelMode.WALKING,
      },
      (response, status) => {
        if (status === "OK") {
          const duration =
            response.rows[0].elements[0].duration?.text || "Unknown time";
          setWalkingTime(duration);
        } else {
          console.error("DistanceMatrixService failed: " + status);
          setWalkingTime(null);
        }
      }
    );
  };
  

  const speakDirections = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.cancel();
    synth.speak(utterance);
  };

  const handleRoute = async () => {
    const map = mapInstanceRef.current;
    if (!window.google || !destination || !map) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const origin = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const destCoords = await geocodeLocation(destination);
      if (!destCoords) {
        alert("Could not find destination.");
        return;
      }
      await estimateWalkingTime(origin, destCoords);


      const directionsService = new google.maps.DirectionsService();

      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: map,
        });
      } else {
        directionsRendererRef.current.setMap(map);
      }

      directionsService.route(
        {
          origin,
          destination: destCoords,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRendererRef.current.setDirections(result);
            const steps = result.routes[0].legs[0].steps
              .map((s) => s.instructions.replace(/<[^>]+>/g, ""))
              .join(". ");
            speakDirections(`Starting tour to ${destination}. ${steps}`);
            map.panTo(result.routes[0].overview_path[0]);
          } else {
            alert("Failed to render route: " + status);
          }
        }
      );
    });
  };

  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.google && !mapInstanceRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 43.532, lng: -80.228 },
          zoom: 17,
          mapTypeId: "hybrid",
          tilt: 45,
        });
        mapInstanceRef.current = map;
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Side Panel */}
      <div
        style={{
          width: "280px",
          backgroundColor: "#fff",
          padding: "1rem",
          overflowY: "auto",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-300 rounded px-2 w-full py-1"
          />
          {walkingTime ? (
  <p className="text-sm text-gray-500 mb-1 text-center">
     Estimated walk: {walkingTime} from your location
  </p>
): (<p className="text-sm text-gray-500 mb-1 text-center">Be specific.</p>)}
          
          <button
            onClick={handleRoute}
            className="bg-blue-600 text-white w-full py-2 rounded cursor-pointer"
          >
            Start Tour
          </button>
        </div>

        {/* Event List Placeholder */}
        <h2 className="text-lg font-semibold mb-4">📅 Campus Events</h2>
        {/* Event List */}
    {events.length === 0 ? (
      <p className="text-sm text-gray-500">Loading or no events found...</p>
    ) : (
      <ul className="space-y-2">
        {events.map((event, i) => (
          <li key={i}>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {event.title}
            </a>
          </li>
        ))}
      </ul>
    )}

      </div>

      {/* Map */}
      <div
        id="map"
        ref={mapRef}
        style={{ flexGrow: 1, height: "100vh", width: "100%" }}
      />
    </div>
  );
}
