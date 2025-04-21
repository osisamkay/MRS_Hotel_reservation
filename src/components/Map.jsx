import React from 'react';

export function Map() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-center mb-6">Map</h2>
      <div className="bg-blue-100 h-96 relative">
        <div className="mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2800.4750990613366!2d-75.6971235!3d45.4215296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI1JzE3LjUiTiA3NcKwNDEnNDkuNiJX!5e0!3m2!1sen!2sca!4v1625097453844!5m2!1sen!2sca"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}