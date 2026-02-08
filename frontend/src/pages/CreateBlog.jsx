import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            // const config = { headers: { "Content-Type": "multipart/form-data" } }; // Let browser set boundary
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
            await axios.post("/api/blogs", { title, content, images: image ? [image] : [] });
            navigate("/");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error creating blog");
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: "800px" }}>
            <h1>Create Blog</h1>
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
                    {image && <img src={image.startsWith("http") ? image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${image}`} alt="Preview" style={{ width: "100%", marginTop: "10px" }} />}
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
                    Publish
                </button>
            </form>
        </div>
    );
};

export default CreateBlog;
