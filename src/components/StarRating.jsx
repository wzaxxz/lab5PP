// src/components/StarRating.jsx
import React, { useState, useEffect } from 'react';

function StarRating({ eventId, userId, currentRating, onRatingChange }) {
    const [rating, setRating] = useState(currentRating || 0);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(currentRating || 0);
    }, [currentRating]);

    const handleStarClick = async (index) => {
        if (!userId) {
            alert("Будь ласка, увійдіть, щоб оцінити подію.");
            return;
        }

        const newRating = index;
        setRating(newRating);

        try {
            // Відправляємо оцінку на ваш Node.js сервер
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId, userId, rating: newRating }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                // Після успішного збереження/оновлення на сервері,
                // повідомляємо батьківський компонент про зміну
                onRatingChange(newRating);
            } else {
                alert(data.message || "Сталася помилка при збереженні оцінки. Спробуйте ще раз.");
                console.error("Помилка при збереженні оцінки:", data.message);
                // У разі помилки повертаємо попередню оцінку
                setRating(currentRating || 0);
            }
        } catch (error) {
            console.error("Помилка мережі або сервера:", error);
            alert("Сталася помилка зв'язку з сервером. Спробуйте ще раз.");
            // У разі помилки повертаємо попередню оцінку
            setRating(currentRating || 0);
        }
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "on" : "off"}
                        onClick={() => handleStarClick(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        disabled={!userId}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
}

export default StarRating;