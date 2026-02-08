import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("blogs");
    const [blogs, setBlogs] = useState([]);

    // Profile State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            fetchMyBlogs();
        }
    }, [user]);

    const fetchMyBlogs = async () => {
        try {
            const { data } = await axios.get("/api/blogs/myblogs");
            setBlogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await axios.put("/api/auth/profile", { name, email, password });
            alert("Profile Updated");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error updating profile");
        }
    };

    const deleteBlog = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`/api/blogs/${id}`);
                fetchMyBlogs();
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="container" style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
                <button
                    onClick={() => setActiveTab("blogs")}
                    style={{
                        padding: "10px 20px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "blogs" ? "2px solid var(--primary-color)" : "none",
                        cursor: "pointer",
                        color: activeTab === "blogs" ? "var(--primary-color)" : "var(--text-color)",
                        fontWeight: "bold"
                    }}
                >
                    My Blogs
                </button>
                <button
                    onClick={() => setActiveTab("profile")}
                    style={{
                        padding: "10px 20px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "profile" ? "2px solid var(--primary-color)" : "none",
                        cursor: "pointer",
                        color: activeTab === "profile" ? "var(--primary-color)" : "var(--text-color)",
                        fontWeight: "bold"
                    }}
                >
                    Profile Settings
                </button>
            </div>

            {activeTab === "blogs" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2>My Dashboard</h2>
                        <Link to="/write" className="btn" style={{ width: "auto" }}>+ Write New Blog</Link>
                    </div>
                    {blogs.length === 0 ? <p>No blogs found. Start writing!</p> : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ textAlign: "left", color: "var(--text-color)" }}>
                                    <th style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>Title</th>
                                    <th style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>Status</th>
                                    <th style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>Date</th>
                                    <th style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map(blog => (
                                    <tr key={blog._id}>
                                        <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>
                                            <Link to={`/blog/${blog._id}`} style={{ fontWeight: "bold" }}>{blog.title}</Link>
                                        </td>
                                        <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>
                                            {blog.isPublished ?
                                                <span style={{ color: "green", display: "flex", alignItems: "center", gap: "5px" }}><FaCheck /> Published</span> :
                                                <span style={{ color: "orange", display: "flex", alignItems: "center", gap: "5px" }}><FaTimes /> Draft</span>
                                            }
                                        </td>
                                        <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>
                                            <Link to={`/edit/${blog._id}`} style={{ marginRight: "10px", color: "var(--secondary-color)" }}><FaEdit /></Link>
                                            <button onClick={() => deleteBlog(blog._id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === "profile" && (
                <div className="form-container">
                    <h3>Update Profile</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn">
                            Update Profile
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
