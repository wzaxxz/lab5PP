import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function Events({ addBooking }) {
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("dateDesc");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Помилка при завантаженні подій:", error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter((event) => filterType === "all" || event.type === filterType)
    .sort((a, b) => {
      if (sortOption === "dateDesc") return new Date(b.date) - new Date(a.date);
      if (sortOption === "dateAsc") return new Date(a.date) - new Date(b.date);
      return 0;
    });

  return (
    <main>
      <section id="events">
        <h2>Майбутні події</h2>
        <div className="filters">
          <label>
            Фільтр за типом:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Всі</option>
              <option value="концерт">Концерт</option>
              <option value="ярмарок">Ярмарок</option>
              <option value="стендап">Стендап</option>
              <option value="кіно">Кіно</option>
              <option value="театр">Театр</option>
            </select>
          </label>
          <label>
            Сортування:
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="dateDesc">За спаданням дати</option>
              <option value="dateAsc">За зростанням дати</option>
            </select>
          </label>
        </div>
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} addBooking={addBooking} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Events;
