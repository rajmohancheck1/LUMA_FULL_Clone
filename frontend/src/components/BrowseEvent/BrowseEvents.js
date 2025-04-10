import React, { useState } from 'react';
import {
  FaGamepad,
  FaVideo,
  FaMusic,
  FaPalette,
  FaTrophy,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import './BrowseEvents.css';

const BrowseEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('Games');
  const [sortBy, setSortBy] = useState('Recommended For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const sortOptions = ['Recommended For You', 'Most Viewers', 'Recently Started', 'A-Z'];

  const categories = [
    { id: 1, name: 'Games', icon: <FaGamepad />, color: '#9147ff' },
    { id: 2, name: 'IRL', icon: <FaVideo />, color: '#e91916' },
    { id: 3, name: 'Music & DJs', icon: <FaMusic />, color: '#38ca7c' },
    { id: 4, name: 'Creative', icon: <FaPalette />, color: '#ff6b1f' },
    { id: 5, name: 'Esports', icon: <FaTrophy />, color: '#f8af1f' }
  ];

  const allEvents = {
    Games: [
      {
        id: 1,
        title: 'Valorant Tournament Finals',
        viewers: '425K',
        tags: ['FPS', 'Competitive'],
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop',
        organizer: 'ESL Gaming',
        isLive: true
      },
      {
        id: 2,
        title: 'League of Legends World Championship',
        viewers: '215K',
        tags: ['MOBA', 'Esports'],
        thumbnail:
          'https://images.unsplash.com/photo-1511882150382-421056c89033?w=500&h=300&fit=crop',
        organizer: 'Riot Games',
        isLive: true
      },
      {
        id: 3,
        title: 'CS2 Major Tournament',
        viewers: '185K',
        tags: ['FPS', 'Tournament'],
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop',
        organizer: 'BLAST Premier',
        isLive: false
      }
    ],
    IRL: [
      {
        id: 4,
        title: 'Tokyo Street Food Tour',
        viewers: '45K',
        tags: ['Travel', 'Food'],
        thumbnail: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=300&fit=crop',
        organizer: 'Travel Network',
        isLive: true
      },
      {
        id: 5,
        title: 'Cooking Masterclass',
        viewers: '32K',
        tags: ['Cooking', 'Educational'],
        thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop',
        organizer: 'Chef Academy',
        isLive: false
      }
    ],
    'Music & DJs': [
      {
        id: 6,
        title: 'Electronic Music Festival',
        viewers: '95K',
        tags: ['EDM', 'Festival'],
        thumbnail:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
        organizer: 'Ultra Events',
        isLive: true
      },
      {
        id: 7,
        title: 'Jazz Night Live',
        viewers: '28K',
        tags: ['Jazz', 'Live Music'],
        thumbnail:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop',
        organizer: 'Blue Note',
        isLive: true
      }
    ],
    Creative: [
      {
        id: 8,
        title: 'Digital Art Workshop',
        viewers: '15K',
        tags: ['Art', 'Educational'],
        thumbnail:
          'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&h=300&fit=crop',
        organizer: 'Art Academy',
        isLive: true
      },
      {
        id: 9,
        title: 'Graphic Design Masterclass',
        viewers: '12K',
        tags: ['Design', 'Tutorial'],
        thumbnail:
          'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&h=300&fit=crop',
        organizer: 'Design Studio Pro',
        isLive: true
      },
      {
        id: 10,
        title: '3D Modeling Workshop',
        viewers: '8.5K',
        tags: ['3D', 'Modeling'],
        thumbnail:
          'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&h=300&fit=crop',
        organizer: '3D Artists Hub',
        isLive: false
      },
      {
        id: 11,
        title: 'Character Illustration',
        viewers: '10.2K',
        tags: ['Illustration', 'Art'],
        thumbnail:
          'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=500&h=300&fit=crop',
        organizer: 'Illustrators Guild',
        isLive: true
      },
      {
        id: 12,
        title: 'UI/UX Design Workshop',
        viewers: '14.3K',
        tags: ['UI/UX', 'Design'],
        thumbnail:
          'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&h=300&fit=crop',
        organizer: 'UX Design Academy',
        isLive: true
      },
      {
        id: 13,
        title: 'Photography Basics',
        viewers: '9.1K',
        tags: ['Photography', 'Tutorial'],
        thumbnail:
          'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=300&fit=crop',
        organizer: 'Photo Masters',
        isLive: false
      },
      {
        id: 14,
        title: 'Motion Graphics Course',
        viewers: '11.5K',
        tags: ['Animation', 'Design'],
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop',
        organizer: 'Motion Arts Studio',
        isLive: true
      }
    ],
    Esports: [
      {
        id: 9,
        title: 'Dota 2 International',
        viewers: '325K',
        tags: ['MOBA', 'Tournament'],
        thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&h=300&fit=crop',
        organizer: 'Valve',
        isLive: true
      }
    ]
  };

  const liveChannels = [
    {
      id: 1,
      name: 'Alex Gaming',
      game: 'Valorant',
      viewers: '12.5K',
      avatar: 'https://example.com/avatar1.jpg',
      isLive: true
    },
    {
      id: 2,
      name: "Sarah's Art Studio",
      game: 'Digital Art',
      viewers: '8.2K',
      avatar: 'https://example.com/avatar2.jpg',
      isLive: true
    },
    {
      id: 3,
      name: 'Tokyo Food Adventures',
      game: 'IRL',
      viewers: '5.1K',
      avatar: 'https://example.com/avatar3.jpg',
      isLive: true
    },
    {
      id: 4,
      name: 'Pro Gaming League',
      game: 'CS2',
      viewers: '15.3K',
      avatar: 'https://example.com/avatar4.jpg',
      isLive: true
    },
    {
      id: 5,
      name: 'Music Festival Live',
      game: 'Music',
      viewers: '9.7K',
      avatar: 'https://example.com/avatar5.jpg',
      isLive: true
    },
    {
      id: 6,
      name: 'DJ Night Mix',
      game: 'Music & DJs',
      viewers: '7.3K',
      avatar: 'https://example.com/avatar6.jpg',
      isLive: true
    },
    {
      id: 7,
      name: 'Creative Workshop',
      game: 'Art',
      viewers: '4.2K',
      avatar: 'https://example.com/avatar7.jpg',
      isLive: true
    }
  ];

  const userCreatedEvents = [
    {
      id: 1,
      title: 'Weekly Gaming Tournament',
      date: '2025-02-20',
      time: '18:00',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop',
      category: 'Gaming',
      attendees: 120,
      description: 'Join our weekly gaming tournament featuring Valorant and CS2'
    },
    {
      id: 2,
      title: 'Art Workshop Series',
      date: '2025-02-22',
      time: '15:00',
      thumbnail:
        'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&h=300&fit=crop',
      category: 'Creative',
      attendees: 85,
      description: 'Learn digital art techniques from professional artists'
    },
    {
      id: 3,
      title: 'Music Festival 2025',
      date: '2025-03-01',
      time: '20:00',
      thumbnail:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop',
      category: 'Music',
      attendees: 250,
      description: 'Experience live performances from top artists and emerging talents'
    },
    {
      id: 4,
      title: 'Tech Startup Conference',
      date: '2025-03-05',
      time: '09:00',
      thumbnail:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      category: 'Technology',
      attendees: 180,
      description: 'Network with industry leaders and learn about latest tech trends'
    },
    {
      id: 5,
      title: 'Fitness Boot Camp',
      date: '2025-03-10',
      time: '07:00',
      thumbnail:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=300&fit=crop',
      category: 'Health',
      attendees: 45,
      description: 'Intensive workout sessions with certified fitness trainers'
    },
    {
      id: 6,
      title: 'Cooking Masterclass',
      date: '2025-03-15',
      time: '14:00',
      thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop',
      category: 'Food',
      attendees: 60,
      description: 'Learn gourmet cooking techniques from professional chefs'
    }
  ];

  const currentEvents = allEvents[selectedCategory] || [];
  const liveEvents = currentEvents.filter(event => event.isLive);

  return (
    <div className="browse-page">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <div className="sidebar-header">
          <h3>Live Channels</h3>
        </div>
        <div className="live-channels-list">
          {liveChannels.map(channel => (
            <div key={channel.id} className="channel-item">
              <div className="channel-avatar">
                <img src={channel.avatar} alt={channel.name} />
                <div className="live-indicator"></div>
              </div>
              <div className="channel-info">
                <h4>{channel.name}</h4>
                <p className="game-name">{channel.game}</p>
                <p className="viewers">{channel.viewers} viewers</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-wrapper">
        {/* Navigation Categories */}
        <div className="category-nav">
          <div className="nav-content">
            <div className="categories-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-button ${
                    selectedCategory === category.name ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                  style={{
                    '--category-color': category.color,
                    color: selectedCategory === category.name ? category.color : undefined
                  }}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="content-header">
            <h1>{selectedCategory}</h1>
            <div className="header-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder={`Search ${selectedCategory}`}
                  className="search-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <div className="sort-container">
                <button className="sort-button" onClick={() => setSortMenuOpen(!sortMenuOpen)}>
                  <span>Sort: {sortBy}</span>
                  <FaChevronDown />
                </button>
                {sortMenuOpen && (
                  <div className="sort-menu">
                    {sortOptions.map(option => (
                      <button key={option} onClick={() => setSortBy(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Created Events Carousel */}
          <div className="user-events-section">
            <h2 className="section-title">Your Events</h2>
            <div className="events-carousel-container">
              <button className="carousel-nav prev">
                <FaChevronLeft />
              </button>
              <div className="events-carousel">
                {userCreatedEvents.map(event => (
                  <div key={event.id} className="event-carousel-card">
                    <div className="event-thumbnail">
                      <img src={event.thumbnail} alt={event.title} />
                      <div className="event-category">{event.category}</div>
                    </div>
                    <div className="event-carousel-content">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <p className="event-datetime">
                          {event.date} at {event.time}
                        </p>
                        <p className="event-attendees">{event.attendees} attending</p>
                      </div>
                      <p className="event-description">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-nav next">
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Live Events */}
          {liveEvents.length > 0 && (
            <>
              <h2 className="section-title">Live Now</h2>
              <div className="live-events-grid">
                {liveEvents.map(event => (
                  <div key={event.id} className="live-event-card">
                    <div className="thumbnail-container">
                      <img src={event.thumbnail} alt={event.title} className="event-thumbnail" />
                      <div className="live-badge">LIVE</div>
                      <div className="viewers-count">{event.viewers} viewers</div>
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p className="organizer">{event.organizer}</p>
                      <div className="tags">
                        {event.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
