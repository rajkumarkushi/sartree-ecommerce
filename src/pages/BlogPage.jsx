import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BlogPage.css";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.sartree.com/api/v1/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data.data))
      .catch((err) => console.log("Blog fetch error:", err));
  }, []);

  return (
    <div className="blog-wrapper">

      {/* HERO */}
      <header className="blog-hero">
        <img src="/images/hero-rice-banner.jpg" className="blog-hero-img" />
        <div className="blog-hero-text">
          <h1>Rice Knowledge Hub</h1>
          <p>Informative blogs, facts & stories from the world of rice.</p>
        </div>
      </header>

      {/* LIST */}
      <div className="blog-list-container">
        <h2 className="section-title">Latest Articles</h2>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <img
                src="/images/sona-masoori-thumb.jpg"
                alt={blog.title}
                className="blog-card-img"
              />

              <div className="blog-card-body">
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-desc">
                  {blog.short_desc?.slice(0, 120)}...
                </p>

                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/blog/${blog.slug_url}`)}
                >
                  Read More →
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
