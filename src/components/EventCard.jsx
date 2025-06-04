// src/components/EventCard.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import StarRating from "./StarRating";

function EventCard({ event }) {
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailedRatings, setDetailedRatings] = useState([]);

  const user = auth.currentUser;

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

  useEffect(() => {
    const fetchEventRatings = async () => {
      if (user) {
        try {
          const userRatingResponse = await fetch(`${API_URL}/api/ratings/${event.id}/${user.uid}`);
          if (userRatingResponse.ok) {
            const data = await userRatingResponse.json();
            setUserRating(data.rating || 0);
          } else if (userRatingResponse.status === 404) {
            setUserRating(0);
          } else {
            console.error("Error fetching user rating:", userRatingResponse.statusText);
            setUserRating(0);
          }
        } catch (error) {
          console.error("Network error fetching user rating:", error);
          setUserRating(0);
        }
      } else {
        setUserRating(0);
      }

      try {
        const ratingsResponse = await fetch(`${API_URL}/api/ratings/${event.id}?page=${currentPage}&limit=10`);
        if (ratingsResponse.ok) {
          const data = await ratingsResponse.json();
          setAverageRating(data.averageRating || 0);
          setNumberOfRatings(data.numberOfRatings || 0);
          setDetailedRatings(data.ratings);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        } else {
          console.error("Помилка при визначення усіх рейтингів:", ratingsResponse.statusText);
          setAverageRating(0);
          setNumberOfRatings(0);
        }
      } catch (error) {
        console.error("Мережева помилка при визначенні рейтингів:", error);
        setAverageRating(0);
        setNumberOfRatings(0);
      }
    };

    fetchEventRatings();
  }, [event.id, user, currentPage, userRating, API_URL]);

  const handleBooking = async () => {
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty < 1) {
      alert("Виберіть коректну кількість квитків!");
      return;
    }

    if (!user) {
      alert("Увійдіть у свій акаунт, щоб зробити бронювання.");
      return;
    }

    const totalEventPrice = Number(event.price) * qty;

    const newBooking = {
      eventId: event.id,
      title: event.title,
      quantity: qty,
      total: totalEventPrice,
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "bookings"), newBooking);
      setBooked(true);
      alert("Бронювання успішно створене!");
    } catch (error) {
      console.error("Помилка при створенні бронювання:", error);
      alert("Сталася помилка при створенні бронювання. Спробуйте ще раз.");
    }
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className={event.available ? "event-card" : "booked-event-card"}>
      <img src={event.image} alt={event.title} />
      <h3>{event.title}</h3>
      <p className="event-date">
        Дата:{" "}
        {new Date(event.date).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p>Місце: {event.location}</p>
      <p className="event-price">Ціна: {event.price} грн</p>

      {/* Відображення середньої оцінки */}
      {numberOfRatings > 0 && (
        <p>
            Середня оцінка: {averageRating.toFixed(1)}{' '}
            <span style={{color: '#ffd700'}}>&#9733;</span>{' '}
            ({numberOfRatings} оцінок)
        </p>
      )}
      {/* Список детальних відгуків (пагінація) */}
      {numberOfRatings > 0 && (
        <button onClick={() => setShowAllRatings(!showAllRatings)} className="toggle-ratings-button">
          {showAllRatings ? "Згорнути відгуки" : "Переглянути відгуки"}
        </button>
      )}

      {showAllRatings && (
        <div className="detailed-ratings-section">
          <h4>Відгуки:</h4>
          <ul>
            {detailedRatings.map((ratingItem, index) => (
              <li key={ratingItem._id || index}>
                Оцінка: {ratingItem.rating} <span style={{color: '#ffd700'}}>&#9733;</span>{' '}
                (Користувач: {ratingItem.userId.substring(0, 5)}...) - {new Date(ratingItem.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Попередня</button>
              <span>Сторінка {currentPage} з {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Наступна</button>
            </div>
          )}
        </div>
      )}


      {/* Компонент StarRating */}
      {user && (
        <StarRating
          eventId={event.id}
          userId={user.uid}
          currentRating={userRating}
          onRatingChange={handleRatingChange}
        />
      )}

      {event.available ? (
        <>
          <label>
            Кількість квитків:
            <input
              type="number"
              className="ticket-quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <button
            className="book-button"
            onClick={handleBooking}
            disabled={booked}
          >
            {booked ? "Заброньовано" : "Забронювати"}
          </button>
        </>
      ) : (
        <button className="book-button" disabled>
          Відбулась
        </button>
      )}
    </div>
  );
}

export default EventCard;