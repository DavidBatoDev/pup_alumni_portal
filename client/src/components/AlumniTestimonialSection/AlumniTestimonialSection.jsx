// src/components/AlumniTestimonialSection/AlumniTestimonialSection.jsx
import React from 'react';
import './AlumniTestimonialSection.css';

const testimonials = [
  {
    quote: "Joining the alumni network has been a wonderful experience. I’ve reconnected with old friends and made valuable professional connections.",
    name: "John Reyes",
    class: "Class of 2015"
  },
  {
    quote: "The alumni portal is a fantastic resource for career development. I found my current job through the job board and couldn’t be happier.",
    name: "Maria Santos",
    class: "Class of 2010"
  },
  {
    quote: "Joining the alumni network has been a wonderful experience. I’ve reconnected with old friends and made valuable professional connections.",
    name: "Anne Lee",
    class: "Class of 2012"
  }
];

const AlumniTestimonialSection = () => {
  return (
    <div className="alumni-testimonial-section">
      <div className="container">
        <h2 className="section-title">WHAT OUR ALUMNI SAY</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="quote">“{testimonial.quote}”</p>
              <p className="name">{testimonial.name}</p>
              <p className="class">{testimonial.class}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumniTestimonialSection;
