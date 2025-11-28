import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="home-hero">
        <h1>Welcome Back!</h1>
        <p>Discover Movies, Concerts, and Events happening near you.</p>
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Recommended For You</h2>
        <div className="carousel">
          {[1,2,3,4,5].map((item) => (
            <div key={item} className="carousel-card">
              <img src={`https://picsum.photos/300/400?random=${item + 10}`} alt="recommended" />
              <h3 className="card-title">Event {item}</h3>
              <Link to={`/book/${item}`} className="btn btn-book-small">Book</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
