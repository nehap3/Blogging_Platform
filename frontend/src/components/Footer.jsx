import React from "react";

const Footer = () => {
    return (
        <footer style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "50px",
            borderTop: "1px solid var(--border-color)",
            color: "var(--text-color)",
            fontSize: "0.9rem"
        }}>
            <p>&copy; {new Date().getFullYear()} Blogify. All rights reserved.</p>
            <p>Built with MERN Stack.</p>
        </footer>
    );
};

export default Footer;
