import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const EditBlog = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/blogs/${id}`);
                setTitle(data.title);
                setContent(data.content);
                if (data.images && data.images.length > 0) {
                    setImage(data.images[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchBlog();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            // const config = { headers: { "Content-Type": "multipart/form-data" } };
            const { data } = await axios.post("/api/upload", formData);
            setImage(data.image);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Image upload failed");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/blogs/${id}`, { title, content, images: [image] });
            navigate(`/blog/${id}`);
        } catch (error) {
            alert("Error updating blog");
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: "800px" }}>
            <h1>Edit Blog</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={uploadFileHandler}
                    />
                    {image && <img src={image} alt="Preview" style={{ width: "100%", marginTop: "10px" }} />}
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        className="form-control"
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn" style={{ marginTop: "20px" }}>
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
