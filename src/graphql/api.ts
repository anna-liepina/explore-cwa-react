import { fetchAreas } from "./requests/fetchAreas";
import { fetchIncidents } from "./requests/fetchIncidents";
import { fetchMarkers } from "./requests/fetchMarkers";
import { fetchPostcodes } from "./requests/fetchPostcodes";
import { fetchProperties } from "./requests/fetchProperties";
import { fetchTimelines } from "./requests/fetchTimelines";
import { fetchTransactions } from "./requests/transactionSearch";

const api = {
    fetchMarkers,
    fetchProperties,
    fetchIncidents,
    fetchAreas,
    fetchPostcodes,
    fetchTimelines,
    fetchTransactions,
};

export default api;
