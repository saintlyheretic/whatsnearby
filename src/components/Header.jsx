import { useState } from 'react';
import './Header.css';

export default function Header({ onUseMyLocation, onSearch, isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">WHAT'S NEARBY?</h1>
        
        <div className="header-actions">
          <button 
            className="location-btn"
            onClick={onUseMyLocation}
            disabled={isLoading}
          >
            📍 Use My Location
          </button>
          
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              className="search-input"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="search-btn"
            >
              🔍
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}