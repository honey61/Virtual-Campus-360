

import React, { useState } from 'react';
import gsap from 'gsap';

// Checkpoints with position and lookAt values
const checkpoints = {
  'Main Gate': {
    position: [4, 0.15, 2.6],
    lookAt: [3.2, 0.2,2.6 ]
  },
  'Library': {
    position: [-1.1, 0.3, -1.3],
    lookAt: [-1.6, 0.4, 0]
  },
  'School of Management': {
    position: [-3.5, 0.1, 3.2],
    lookAt: [-4.2, 0, 3.1]
  },
  'School of Computer Application': {
    position: [-3.8, 0.1, 3.7],
    lookAt: [-4.5, 0, 3.9]
  },
  'Reception': {
    position: [1.4, 0.2, 2.5],
    lookAt: [1.7, 0.1, 3.2]
  },
  'School of Polytechnic': {
    position: [1.4, 0, 2.5],
    lookAt: [0.5, 0.3,2]
  },
  'Canteen': {
    position: [-3.6, 0.1, 3.],
    lookAt: [-3.1, 0.1, 3.8]
  },
  'School of Computing': {
    position: [0.1, 0.6,-1.5],
    lookAt: [-1, 0.4, -3.6]
  },
  'School of Nursing': {
    position: [0.8, 0.3,-0.2],
    lookAt: [0, 0.2, -0.6]
  }
};

// Information and image for each checkpoint
const popupContent = {
  'Main Gate': {
    text: 'Step into the world of opportunities through our iconic Main Gate — your journey begins here!',
    image: '/main.jpeg'
  },
  'Library': {
    text: 'Dive into the ocean of knowledge at our library, your gateway to endless learning and discovery.',
    image: '/library.jpeg'
  },
  'School of Management': {
    text: 'Empowering future leaders! The School of Management is where ideas turn into impactful strategies.',
    image: '/schoolofmanagement.jpeg'
  },
  'School of Computer Application': {
    text: 'Code your dreams to reality at the School of Computer Application — innovation starts here.',
    image: '/Computerapplication.jpeg'
  },
  'Reception': {
    text: 'Welcome to the heart of assistance and hospitality! The reception is your first stop for guidance.',
    image: '/reception.jpeg'
  },
  'School of Polytechnic': {
    text: 'Crafting the engineers of tomorrow! The School of Polytechnic is where creativity meets skill.',
    image: '/schoolofpoly.jpeg'
  },
  'Canteen': {
    text: 'Savor the flavors of friendship and food at our lively canteen — where meals turn into memories.',
    image: '/Canteen.jpeg'
  },
  'School of Computing': {
    text: 'Innovate, create, and compute your way to excellence at the School of Computing.',
    image: '/schoolofcomputing.jpeg'
  },
  'School of Nursing': {
    text: 'Dedicated to healing the world, the School of Pharmacy is where science meets compassion.',
    image: '/nursing.jpeg'
  }
};


export default function Checkpoints({ camera, onCheckpointSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('Select Location');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckpointSelect = (checkpoint) => {
    
    setSelectedCheckpoint(checkpoint);
    setIsOpen(false);

    if (camera) {
      const { position, lookAt } = checkpoints[checkpoint];

      // Pass lookAt values to the CollegeModel
      if (onCheckpointSelect) {
        onCheckpointSelect(position, lookAt);
      }

      // Use lookAt once to calculate the rotation, then animate it
      camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
      const targetRotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z
      };

      // Reset rotation to avoid a "snap" at the start
      // camera.rotation.set(0, 0, 0);

      // GSAP animation for both position and rotation
      gsap.to(camera.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2,
        ease: 'power2.inOut'
      });

      gsap.to(camera.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          setPopupData(popupContent[checkpoint]);
          setShowPopup(true);
        }
      });
    } else {
      console.warn("Camera is not available for animation");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="checkpoint-bar">
      <div className="custom-dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          {selectedCheckpoint}
        </div>
        {isOpen && (
          <ul className="dropdown-list">
            {Object.keys(checkpoints).map((checkpoint) => (
              <li
                key={checkpoint}
                className="dropdown-item"
                onClick={() => handleCheckpointSelect(checkpoint)}
              >
                {checkpoint}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popup for checkpoint information */}
      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2 className="popup-heading">{selectedCheckpoint}</h2> {/* Added heading */}
      <img 
        src={popupData.image} 
        alt={selectedCheckpoint} 
        className="popup-image" 
        style={{ width: '500px', height: '600px', objectFit: 'contain' }} 
      />
      <p>{popupData.text}</p>
      <button onClick={closePopup}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}
