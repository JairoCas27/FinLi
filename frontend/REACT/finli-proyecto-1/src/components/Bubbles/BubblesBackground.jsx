// src/components/Common/BubblesBackground.jsx
import React from 'react';
import '../../pages/Nosotros/nosotros.css'; 

function BubblesBackground() {
    return (
        <div className="bubbles">
            <div className="bubble bubble-verdeCla bubble-small" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>$</div>
            <div className="bubble bubble-verdeOs bubble-medium" style={{ top: '20%', left: '85%', animationDelay: '2s' }}>$</div>
            <div className="bubble bubble-amarrillo bubble-large" style={{ top: '40%', left: '10%', animationDelay: '4s' }}>$</div>
            <div className="bubble bubble-plomo bubble-small" style={{ top: '60%', left: '90%', animationDelay: '6s' }}>$</div>
            <div className="bubble bubble-verdeCla bubble-medium" style={{ top: '80%', left: '15%', animationDelay: '1s' }}>$</div>
            <div className="bubble bubble-verdeOs bubble-small" style={{ top: '30%', left: '70%', animationDelay: '3s' }}>$</div>
            <div className="bubble bubble-amarrillo bubble-medium" style={{ top: '50%', left: '80%', animationDelay: '5s' }}>$</div>
            <div className="bubble bubble-plomo bubble-large" style={{ top: '70%', left: '5%', animationDelay: '7s' }}>$</div>
            <div className="bubble bubble-verdeCla bubble-small" style={{ top: '15%', left: '50%', animationDelay: '0.5s' }}>$</div>
            <div className="bubble bubble-verdeOs bubble-medium" style={{ top: '45%', left: '30%', animationDelay: '2.5s' }}>$</div>
            <div className="bubble bubble-amarrillo bubble-small" style={{ top: '75%', left: '60%', animationDelay: '4.5s' }}>$</div>
            <div className="bubble bubble-plomo bubble-medium" style={{ top: '25%', left: '25%', animationDelay: '6s' }}>$</div>
            <div className="bubble bubble-verdeCla bubble-large" style={{ top: '55%', left: '45%', animationDelay: '1.5s' }}>$</div>
            <div className="bubble bubble-verdeOs bubble-small" style={{ top: '85%', left: '75%', animationDelay: '3.5s' }}>$</div>
            <div className="bubble bubble-amarrillo bubble-medium" style={{ top: '35%', left: '95%', animationDelay: '5s' }}>$</div>
        </div>
    );
}

export default BubblesBackground;