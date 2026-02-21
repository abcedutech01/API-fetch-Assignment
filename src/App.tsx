import React from 'react';
import ArtworkTable from './main/ArtworkTable';

function App() {
  return (
    <div style={{padding: '20px', borderRadius: "10px"}}>
      <h2 style={{fontFamily: 'Arial, sans-serif', textAlign: 'center', color: "white",backgroundColor: "black", borderRadius: "20px 20px 0px 0px", padding: "20px"}}>Data Of Art Institute of Chicago</h2>
      <ArtworkTable/>
    </div>
  );
}

export default App;
