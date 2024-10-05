import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null); // Thêm state cho lỗi
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get('keyword');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/search?keyword=${keyword}`);
        setResults(response.data);
        setError(null); // Đặt lỗi về null khi thành công
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("An error occurred while fetching search results."); // Thiết lập thông báo lỗi
      }
    };

    // Kiểm tra xem keyword có hợp lệ không
    if (keyword && keyword.trim()) {
      fetchResults();
    }
  }, [keyword]);

  return (
    <div className="container">
      <h2>Search Results for: {keyword}</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* Hiển thị thông báo lỗi */}
      {results.length === 0 && !error ? ( // Chỉ hiển thị "No results found" khi không có lỗi
        <p>No results found.</p>
      ) : (
        <ul className="list-group">
          {results.map(post => (
            <li key={post.id} className="list-group-item">
              <h5>{post.title || "Untitled"}</h5> {/* Hiển thị tiêu đề hoặc "Untitled" nếu không có */}
              <p dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Hiển thị nội dung với HTML */}
              <Link to={`/blogs/${post.id}`} className="btn btn-primary">View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;
