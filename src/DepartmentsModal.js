import React from "react";
import './styles/App.css';

const DepartmentsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if the modal is closed
  const departments = [
    {
      category: "Polytechnic",
      list:["Computer Science", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
    },
    {
      category: "Hospitality Management",
      list: ["Bachelor in Hospitality", "Diploma in Hospitality", "Bsc. Agriculture", "Bsc .BIO-Technology"],
    },
    {
      category: "Pharmacy",
      list: ["Bachelor in Pharmacy", "Master in Pharmacy"],
    },
    {
      category: "Engineering",
      list: ["Computer Science", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
    },
  ];
  return (
    <div className="modal-overlay-d">
      <div className="modal-content-d">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="departments-page">
      <header className="departments-header">
        <h1>Departments</h1>
        <p>Explore our diverse range of academic departments dedicated to excellence in education and research.</p>
      </header>
      <main className="departments-content">
        {departments.map((dept, index) => (
          <section key={index} className="department-category">
            <h2>{dept.category}</h2>
            <ul>
              {dept.list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
      </div>
    </div>
  );
};

export default DepartmentsModal;
