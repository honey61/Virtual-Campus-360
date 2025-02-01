import React, { useState } from "react";
import DepartmentsModal from "./DepartmentsModal";
import AdmissionsModal from "./AdmissionsModal";
import "./styles/App.css";

const Footer = () => {
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);

  const openAdmissionsModal = () => setIsAdmissionsModalOpen(true);
  const closeAdmissionsModal = () => setIsAdmissionsModalOpen(false);

  const openDepartmentsModal = () => setIsDepartmentsModalOpen(true);
  const closeDepartmentsModal = () => setIsDepartmentsModalOpen(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          {/* College Information */}
          <div className="footer-section about">
            <h2>About Us</h2>
            <p>
              Welcome to GRD-IMT, where we foster innovation, excellence, and discovery.
              Join us in our mission to shape a better future through education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="#about">About</a></li>
              <li>
                <a href="#admission" onClick={openAdmissionsModal}>
                  Admissions
                </a>
              </li>
              <li>
                <a href="#departments" onClick={openDepartmentsModal}>
                  Departments
                </a>
              </li>
              <li><a href="#events">Events</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section contact">
            <h2>Contact Us</h2>
            <p><strong>Address:</strong> Rajpur Road, Dehradun Uttarakhand</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Email:</strong> info@GRD.edu</p>
          </div>

          {/* Social Media Links */}
          <div className="footer-section social">
            <h2>Follow Us</h2>
            <a href="https://www.facebook.com/GRDIMTInstitute" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://x.com/GrdInstitute" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://www.instagram.com/grdimtofficial/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} [GRD-IMT (HARVINDER ,PREETI,ANSHUL,ABHISHEK)]. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AdmissionsModal isOpen={isAdmissionsModalOpen} onClose={closeAdmissionsModal} />
      <DepartmentsModal isOpen={isDepartmentsModalOpen} onClose={closeDepartmentsModal} />
    </>
  );
};

export default Footer;
