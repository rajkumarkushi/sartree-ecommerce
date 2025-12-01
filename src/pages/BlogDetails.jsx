import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BlogPage.css";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.sartree.com/api/v1/blogs")
      .then((res) => res.json())
      .then((data) => {
        const match = data.data.find((b) => b.slug_url === slug);
        setBlog(match);
      })
      .catch((err) => console.log("Blog fetch error:", err));
  }, [slug]);

  if (!blog) return <p className="loading-text">Loading...</p>;

  return (
    <div className="blog-details-wrapper">

      {/* HERO */}
      <header className="blog-details-hero">
        <img
          src="/images/hero-rice-banner.jpg"
          className="blog-details-img"
        />
        <div className="blog-details-text">
          <h1>{blog.title}</h1>
        </div>
      </header>

      {/* CONTENT */}
      <div className="details-content">

        <button className="back-btn" onClick={() => navigate("/blog")}>
          ← Back to Blogs
        </button>

        <p className="blog-short">{blog.short_desc}</p>

        <section className="blog-full-content">
          <p>{blog.description}</p>
        </section>

      </div>
    </div>
  );
}
