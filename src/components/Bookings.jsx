import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(userBookings);
      } catch (error) {
        console.error("Помилка завантаження бронювань:", error);
      }
    };

    fetchBookings();
  }, [user]);

  const totalTickets = bookings.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = bookings.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm("Ви впевнені, що хочете скасувати це бронювання?");
    if (confirmCancel) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        setBookings(bookings.filter(b => b.id !== bookingId));
      } catch (error) {
        console.error("Помилка скасування бронювання:", error);
      }
    }
  };

  return (
    <main>
      <section id="bookings">
        <h2>Мої бронювання</h2>
        <ul className="bookings-list">
          {bookings.map((item) => (
            <li key={item.id}>
              {item.title} – {item.quantity} квитків (Сума: {item.total} грн)
              <button
                className="cancel-button"
                onClick={() => handleCancel(item.id)}
                title="Скасувати бронювання"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <div className="summary">
          <p><strong>Загальна кількість квитків:</strong> {totalTickets}</p>
          <p><strong>Загальна сума бронювань:</strong> {totalPrice} грн</p>
        </div>
      </section>
    </main>
  );
}

export default Bookings;
