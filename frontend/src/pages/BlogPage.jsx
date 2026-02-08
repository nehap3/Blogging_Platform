import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";

const BlogPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/blogs/${id}`);
                setBlog(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchComments = async () => {
            try {
                const { data } = await axios.get(`/api/comments/${id}`);
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlog();
        fetchComments();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`/api/blogs/${id}`);
                navigate("/");
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/comments", {
                blogId: id,
                content: commentContent,
            });
            setComments([...comments, data]);
            setCommentContent("");
        } catch (error) {
            alert("Error adding comment");
        }
    };

    if (!blog) return <div>Loading...</div>;

    return (
        <div>
            <Helmet>
                <title>{blog.title} - Blogify</title>
                <meta name="description" content={blog.content.substring(0, 150)} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.content.substring(0, 150)} />
                {blog.images && blog.images.length > 0 && <meta property="og:image" content={blog.images[0]} />}
            </Helmet>
            <h1>{blog.title}</h1>
            <p>
                By {blog.author?.name} | {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            {blog.images && blog.images.length > 0 && (
                <img src={blog.images[0]} alt={blog.title} style={{ maxWidth: "100%", maxHeight: "400px" }} />
            )}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} style={{ marginTop: "20px" }}></div>

            {user && (user._id === blog.author?._id || user.isAdmin) && (
                <div style={{ marginTop: "20px" }}>
                    <button onClick={() => navigate(`/edit/${id}`)} className="btn" style={{ width: "auto", marginRight: "10px" }}>Edit</button>
                    <button onClick={handleDelete} className="btn" style={{ width: "auto", backgroundColor: "red" }}>Delete</button>
                </div>
            )}

            <hr style={{ margin: "40px 0" }} />

            <h3>Comments</h3>
            {user ? (
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="form-control"
                        placeholder="Write a comment..."
                    />
                    <button type="submit" className="btn" style={{ marginTop: "10px", width: "auto" }}>
                        Add Comment
                    </button>
                </form>
            ) : (
                <p>Please login to comment</p>
            )}

            <div>
                {comments.map((comment) => (
                    <div key={comment._id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                        <strong>{comment.user?.name}</strong> <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
