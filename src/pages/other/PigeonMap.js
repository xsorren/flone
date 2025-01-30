// components/PigeonMap.js
import { Map, Marker } from 'pigeon-maps';

const PigeonMap = ({ lat, lng }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Map 
        center={[lat, lng]} 
        zoom={15}
      >
        <Marker width={50} anchor={[lat, lng]} />
      </Map>
    </div>
  );
};

export default PigeonMap;