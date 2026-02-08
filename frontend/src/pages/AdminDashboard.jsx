import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get("/api/admin/stats");
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/admin/users");
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`/api/admin/users/${id}`);
                fetchUsers();
                fetchStats();
            } catch (error) {
                alert("Error deleting user");
            }
        }
    };

    const deleteBlog = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`/api/blogs/${id}`); // Admin can delete any blog
                fetchStats();
            } catch (error) {
                alert("Error deleting blog");
            }
        }
    };

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
                <div className="card" style={{ background: "#eee", padding: "20px", flex: 1 }}>
                    <h3>Total Users</h3>
                    <p>{stats.userCount}</p>
                </div>
                <div className="card" style={{ background: "#eee", padding: "20px", flex: 1 }}>
                    <h3>Total Blogs</h3>
                    <p>{stats.blogCount}</p>
                </div>
                <div className="card" style={{ background: "#eee", padding: "20px", flex: 1 }}>
                    <h3>Total Comments</h3>
                    <p>{stats.commentCount}</p>
                </div>
            </div>

            <div style={{ display: "flex", gap: "40px" }}>
                <div style={{ flex: 1 }}>
                    <h2>Users</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left" }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.isAdmin ? "Yes" : "No"}</td>
                                    <td>
                                        {!u.isAdmin && (
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                style={{ background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ flex: 1 }}>
                    <h2>Recent Blogs</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left" }}>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.latestBlogs && stats.latestBlogs.map((b) => (
                                <tr key={b._id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td><Link to={`/blog/${b._id}`}>{b.title}</Link></td>
                                    <td>{b.author?.name}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteBlog(b._id)}
                                            style={{ background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
