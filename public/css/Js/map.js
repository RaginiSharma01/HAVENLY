// Debug logging
console.log("=== MAP.JS DEBUG ===");
console.log("Map Token exists:", typeof mapToken !== 'undefined');
console.log("Map Token value:", mapToken);
console.log("Listing Coordinates exists:", typeof listingCoordinates !== 'undefined');
console.log("Listing Coordinates:", listingCoordinates);
console.log("Mapbox GL exists:", typeof mapboxgl !== 'undefined');

// Only initialize map if coordinates exist
if (listingCoordinates && listingCoordinates.length === 2 && mapToken) {
    console.log("✓ All requirements met, initializing map...");
    
    try {
        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: listingCoordinates,
            zoom: 9
        });

        console.log("✓ Map created successfully");

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat(listingCoordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h6>${listingTitle}</h6><p>${listingLocation}</p>`)
            )
            .addTo(map);

        console.log("✓ Marker added successfully");
        
    } catch (error) {
        console.error("✗ Error creating map:", error);
        document.getElementById('map').innerHTML = `<p class="text-center text-danger">Error loading map: ${error.message}</p>`;
    }
    
} else {
    console.error("✗ Missing requirements:");
    console.error("  - Coordinates valid:", listingCoordinates && listingCoordinates.length === 2);
    console.error("  - Map token exists:", !!mapToken);
    
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        mapDiv.innerHTML = '<p class="text-center text-muted">Location coordinates not available for this listing.</p>';
    }
}