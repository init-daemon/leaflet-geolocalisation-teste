class GeoLocalisation {
    constructor(map = null) {
        this.map = map;
        this.markers = [];
    }

    getMap() {
        return this.map;
    }

    setMap(map) {
        this.map = map;
    }

    lastGPSPosition() {
        if (this.markers.length > 0) {
            const marker = this.markers[this.markers.length - 1];
            return marker.getLatLng();
        }
    }

    removeMarker(marker) {
        let indexOfMarker = markers.indexOf(marker);
        if (this.map) this.map.removeLayer(marker);
        if (indexOfMarker !== -1) {
            markers.splice(indexOfMarker, 1); // Retirez-le du tableau
        }
    }

    clearMarkers() {
        if(this.markers.length > 0) {
            do {
                this.markers[this.markers.length-1]?.remove();
            } while(this.markers.pop());
        }
    }

    createMarker(latLog = []) {
        const marker = L.marker(latLog);
        marker.addTo(this.map);
        this.setMarker(marker);
        return marker;
    }

    setMarker(marker, zoom = 13) {
        this.markers.push(marker);
        this.map.setView(marker.getLatLng(), zoom);
        return marker;
    }

    /**
     * if longitude is defined, then it's search by GPS coordinate else search by address 
     */
    async getOpenstreetmapJson(latitudeOrAddress, longitude = null) {
        const openStreemapApiLink = "https://nominatim.openstreetmap.org/";
        let url;
        if (latitudeOrAddress && longitude) {
            url = `${openStreemapApiLink}reverse?format=json&lat=${latitudeOrAddress}&lon=${longitude}`;
        } else {
            url = `${openStreemapApiLink}search?format=json&q=${latitudeOrAddress}`;
        }
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Erreur de géocodage inverse :', error);
            throw error;
        }
    }



    async getGPSPositionOfAddress(address) {

        try {
            const data = await this.getOpenstreetmapJson(address);
            if (data.length > 0) {
                const firstLatitude = parseFloat(data[0].lat);
                const firstLongitude = parseFloat(data[0].lon);
                return {
                    data,
                    firstLatitude,
                    firstLongitude
                };
            } else {
                throw new Error('Ville non trouvée.');
            }
        } catch (error) {
            console.error('Erreur de recherche :', error);
            throw error;
        }
    }
}
