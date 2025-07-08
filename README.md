# 3DGraphTour Project Documentation

## 1. Project Inspiration

The idea for **3DGraphTour** emerged from a desire to transform traditional campus tours into an immersive, interactive experience:

- **Engagement Gap:** Standard web-based maps often feel static and fail to capture the spatial logic of large campuses.
- **Accessibility:** Prospective students can’t always visit in person, so we wanted to offer a real-time, 3‑dimensional walkthrough that feels close to being on-site.
- **Innovation:** By combining modern visualization techniques with live data, we could create a dynamic tour that adapts as campus facilities, events, and user preferences change.

## 2. Project History & Evolution

1. **Prototype Phase (June 2025):**

   - Built a basic 2D map overlay with markers for key buildings using Google Maps JavaScript API.

2. **3D Integration (June 2025):**

   - Incorporated 3D building models using the Google Maps Platform Elevation and 3D Tiles.

3. **Public Launch (July 2025):**

   - Deployed on Netlify

## 3. Use of Google Maps Platform

- **Maps JavaScript API:** Serves as the core renderer for base maps, custom markers, and event overlays.
- **3D Tiles & WebGL Overlay View:** Enables seamless embedding of 3D campus models alongside standard map layers.
- **Places Library:** Powers search and autocomplete for campus points of interest.
- **Directions API:** Calculates optimal walking routes between tour stops (including stairs and elevators).

## 4. Key Learnings

- **Performance Tuning:** Balancing high-fidelity 3D rendering with smooth framerates required:

  - Lazy-loading distant model tiles
  - Balancig efficient request rates to avoid hitting API quotas

**Repository & Resources:**

- GitHub: `https://github.com/kennyyy5/3dgryphtour/`
- Live Demo: `https://3d-gryph-tour.netlify.app/`

**Contact & Contribution:**
For issues or feature requests, please open an issue on GitHub or reach out to the dev team at `kadenuga@uoguelph.ca`.
