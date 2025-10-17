import React from 'react';
import '../pages/About.css';
import { MdLocationOn, MdPhone, MdEmail, MdCheckCircle, MdRiceBowl, MdBusiness, MdLocalHospital, MdEco, MdHome } from 'react-icons/md';

const certifications = [
  'ISO 9001 – Quality Management System',
  'ISO 22000 – Food Safety Management',
  'HACCP – Hazard Analysis and Critical Control Points',
  'GMP – Good Manufacturing Practices',
  'FSSC 22000 – Food Safety System Certification',
  'GHPS – Good Hygiene Practices Standards',
];

const riceVarieties = [
  'IR64 (Raw, Steam & Parboiled)',
  'Indian Swarna (Raw, Steam & Parboiled)',
  'Indian Sona Masoori Rice (Raw, Steam & Parboiled)',
  'HMT Rice (Raw, Steam & Parboiled)',
  'RNR Rice (Raw, Steam & Parboiled)',
];

const packagingOptions = [
  '1 KG',
  '5 KG',
  '10 KG',
  '25 KG',
  '50 KG',
  'Customized packing as per buyer requirements',
];

const businessSectors = [
  {
    icon: <MdLocalHospital size={32} />, 
    title: 'Healthcare Sector',
    desc: 'Owns and operates three multi-specialty hospitals under Belief Hospitals Group, providing quality healthcare services.'
  },
  {
    icon: <MdEco size={32} />,
    title: 'Aquaculture',
    desc: 'Over 100 acres dedicated to aquaculture, contributing to sustainable fish and shrimp farming.'
  },
  {
    icon: <MdRiceBowl size={32} />,
    title: 'Agriculture – Paddy Cultivation',
    desc: 'Extensive involvement in paddy cultivation supports the integrated rice business model.'
  },
  {
    icon: <MdHome size={32} />,
    title: 'Real Estate',
    desc: 'Strategic investments in real estate development for residential and commercial projects.'
  },
];

const About = () => {
  return (
    <div className="about-container redesigned">
      {/* Company Overview */}
      <section className="about-section company-overview">
        <h1>SAR Group of Industries</h1>
        <p className="subtitle">A legacy of excellence in rice processing, supply, and distribution since 1995</p>
        <div className="overview-grid">
          <div className="overview-details">
            <h2>Our Rice Units</h2>
            <ul>
              <li>M/S SAR TREE RICE INDUSTRIES</li>
              <li>M/S SAR RICE INDUSTRIES</li>
              <li>M/S SRI AARADYA RICE MILL</li>
            </ul>
            <p><strong>Founded:</strong> 1995</p>
            <p><strong>Location:</strong> SY NO 2/1/A/1/1, 12/3/E/1 Sivaru Venkatapuram, Konijerla Mandal, Khammam District, Telangana</p>
            <p><strong>Promoters:</strong> Mr. Balakrishna Medempudi & Mrs. Rama Jyothi Medempudi (Post Graduates, 30+ years in agro-industry)</p>
            <p>SAR Group is a family-run enterprise with a deep-rooted understanding of the rice industry, built on consistent quality management and a commitment to excellence in both domestic and international markets.</p>
          </div>
          <div className="overview-image">
            <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop" alt="SAR Group Rice Mills" />
          </div>
        </div>
      </section>

      {/* Certifications & Technology */}
      <section className="about-section certifications-tech">
        <h2>Certifications & Technology</h2>
        <div className="certifications-list">
          {certifications.map((cert, idx) => (
            <div className="cert-item" key={idx}>
              <MdCheckCircle className="cert-icon" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
        <div className="tech-details">
          <p>
            Our rice mills are equipped with state-of-the-art technology, including imported machinery from Satake and Miltec, ensuring 24/7, 365-day operations. With a robust production capacity of <strong>24 Metric Tons per hour</strong> and storage capacity of over <strong>1 Lakh square feet</strong>, we produce high-quality, hygienically processed, sortexed, and packed rice.
          </p>
          <p>
            Our in-house laboratory enables stringent product testing, using advanced equipment to ensure adherence to international quality standards.
          </p>
        </div>
      </section>

      {/* Product Portfolio */}
      <section className="about-section product-portfolio">
        <h2>Product Portfolio</h2>
        <div className="product-details">
          <h3>Non-Basmati Rice Varieties</h3>
          <ul>
            {riceVarieties.map((variety, idx) => (
              <li key={idx}><MdRiceBowl className="rice-icon" /> {variety}</li>
            ))}
          </ul>
          <h3>Packaging Options</h3>
          <ul className="packaging-list">
            {packagingOptions.map((pack, idx) => (
              <li key={idx}>{pack}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Market Presence */}
      <section className="about-section market-presence">
        <h2>Market Presence</h2>
        <p>
          SAR Group is a dominant player in the domestic market, especially in Andhra Pradesh and Telangana, with our reputed brand <strong>B9 Bio</strong>. With a strong domestic foundation, we are expanding into international markets, supplying premium rice varieties worldwide.
        </p>
        <div className="market-stats">
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Rice Units</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24 MT/hr</span>
            <span className="stat-label">Production Capacity</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1 Lakh+ sq.ft</span>
            <span className="stat-label">Storage</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30+ yrs</span>
            <span className="stat-label">Industry Experience</span>
          </div>
        </div>
      </section>

      {/* Customer-Centric Philosophy */}
      <section className="about-section philosophy">
        <h2>Customer-Centric Philosophy</h2>
        <p>
          We pride ourselves on an excellent track record for customer satisfaction, never compromising on quality or service. Our relationships are built on trust, understanding customer needs, and ensuring timely delivery with unwavering quality. Our qualified and professional teams oversee every aspect of operations, providing a competitive edge in both domestic and international markets.
        </p>
      </section>

      {/* Other Business Sectors */}
      <section className="about-section other-sectors">
        <h2>Other Business Sectors</h2>
        <div className="sectors-grid">
          {businessSectors.map((sector, idx) => (
            <div className="sector-card" key={idx}>
              <div className="sector-icon">{sector.icon}</div>
              <div className="sector-info">
                <h3>{sector.title}</h3>
                <p>{sector.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
