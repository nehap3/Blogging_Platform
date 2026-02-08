import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaThLarge, FaList } from "react-icons/fa";

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await axios.get("/api/blogs");
            setBlogs(data.blogs);
        };
        fetchBlogs();
    }, []);

    return (
        <div>
            <Helmet>
                <title>Blogify - Home</title>
                <meta name="description" content="Read the latest blogs on technology, lifestyle, and more." />
            </Helmet>

            <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "var(--accent-color)", border: "3px solid black", borderRadius: "15px", marginBottom: "50px", boxShadow: "8px 8px 0px 0px black" }}>
                <h1 style={{ fontSize: "3.5rem", marginBottom: "15px", fontWeight: "900", color: "black", textShadow: "4px 4px 0px white" }}>HELLO BLOGIFY! 👋</h1>
                <p style={{ fontSize: "1.5rem", marginBottom: "30px", fontWeight: "bold", color: "black" }}>Unleash your inner child and write something fun today!</p>
                <Link to="/write" className="btn" style={{ fontSize: "1.3rem", padding: "15px 40px", background: "white", color: "black" }}>Start Scribbling ✏️</Link>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ fontSize: "2.5rem", transform: "rotate(-2deg)", background: "var(--primary-color)", padding: "5px 15px", border: "3px solid black", display: "inline-block", boxShadow: "4px 4px 0px black" }}>Fresh Stories</h2>
                <div style={{ background: "white", padding: "10px", borderRadius: "10px", border: "3px solid black", display: "flex", gap: "10px", boxShadow: "4px 4px 0px black" }}>
                    <button
                        onClick={() => setIsGridView(true)}
                        style={{ padding: "10px", background: isGridView ? "var(--secondary-color)" : "transparent", border: "2px solid black", borderRadius: "8px", cursor: "pointer", color: "black", display: "flex", fontWeight: "bold" }}
                    >
                        <FaThLarge size={24} />
                    </button>
                    <button
                        onClick={() => setIsGridView(false)}
                        style={{ padding: "10px", background: !isGridView ? "var(--secondary-color)" : "transparent", border: "2px solid black", borderRadius: "8px", cursor: "pointer", color: "black", display: "flex", fontWeight: "bold" }}
                    >
                        <FaList size={24} />
                    </button>
                </div>
            </div>

            {blogs.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "60px", background: "var(--white)" }}>
                    <h3>No stories here yet... 🕸️</h3>
                    <p>Be the cool kid who posts first!</p>
                    <Link to="/write" className="btn" style={{ marginTop: "20px" }}>Write First Post 🚀</Link>
                </div>
            ) : (
                <div style={{
                    display: isGridView ? "grid" : "flex",
                    gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(320px, 1fr))" : "none",
                    flexDirection: isGridView ? "none" : "column",
                    gap: "30px",
                    marginTop: "20px"
                }}>
                    {blogs.map((blog) => (
                        <div key={blog._id} className="card" style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column", background: "black", border: "3px solid white", color: "white" }}>
                            {blog.images && blog.images.length > 0 && isGridView && (
                                <div style={{ borderBottom: "3px solid black" }}>
                                    <img
                                        src={blog.images[0].startsWith("http") ? blog.images[0] : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${blog.images[0]}`}
                                        alt={blog.title}
                                        style={{ width: "100%", height: "220px", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                            <div style={{ padding: "24px", flex: "1", display: "flex", flexDirection: "column" }}>
                                <div style={{ marginBottom: "10px", display: "inline-block", background: "var(--primary-color)", color: "black", border: "2px solid black", padding: "2px 8px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase" }}>
                                    {blog.category || "Random"}
                                </div>
                                <Link to={`/blog/${blog._id}`} style={{ display: "block", marginBottom: "10px", color: "white" }}>
                                    <h2 style={{ fontSize: "1.8rem", lineHeight: "1.1" }}>{blog.title}</h2>
                                </Link>
                                <p style={{ fontSize: "1.1rem", lineHeight: "1.5", flex: "1", marginBottom: "20px", color: "white" }}>
                                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "3px solid black", paddingTop: "15px", marginTop: "auto" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--secondary-color)", border: "2px solid black", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.2rem" }}>
                                            {blog.author?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>{blog.author?.name}</p>
                                        </div>
                                    </div>
                                    <Link to={`/blog/${blog._id}`} style={{ background: "black", color: "white", padding: "5px 10px", borderRadius: "5px", fontWeight: "bold", fontSize: "0.9rem" }}>Read ➝</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
