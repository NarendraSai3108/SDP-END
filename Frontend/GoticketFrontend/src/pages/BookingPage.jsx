import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from "../context/AuthContext";
import Spinner from '../components/common/Spinner';

// Legend for seat colors
const SeatLegend = () => (
  <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 my-4 text-sm text-gray-600">
    <div className="flex items-center">
      <div className="w-5 h-5 bg-white rounded-t-md mr-2 border-2 border-gray-300"></div>
      <span>Available</span>
    </div>
    <div className="flex items-center">
      <div className="w-5 h-5 bg-red-500 rounded-t-md mr-2 border-2 border-red-700"></div>
      <span>Selected</span>
    </div>
    <div className="flex items-center">
      <div className="w-5 h-5 bg-gray-500 rounded-t-md mr-2 border-2 border-gray-600"></div>
      <span>Booked</span>
    </div>
  </div>
);

// Booking summary component
const BookingSummary = ({ event, selectedSeats, onConfirm }) => {
  const ticketPrice = event?.price || 0;
  const totalPrice = (ticketPrice * selectedSeats.length).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-fit sticky top-28">
      <h3 className="text-2xl font-bold mb-4 border-b pb-4">Booking Summary</h3>
      <div className="space-y-2">
        <h4 className="text-xl font-semibold">{event?.title || 'Loading...'}</h4>
        <p className="text-gray-600">{event?.dateTime ? new Date(event.dateTime).toLocaleString() : '...'}</p>
        <p className="text-sm text-gray-500">📍 {event?.venue || '...'}</p>
      </div>
      <div className="border-t my-4 pt-4">
        <h4 className="font-bold text-lg">Selected Seats ({selectedSeats.length})</h4>
        <div className="my-2 p-2 bg-gray-100 rounded min-h-[40px] text-gray-700 font-mono text-center text-sm break-words">
          {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : 'None'}
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600">Ticket Price</span>
          <span className="font-semibold">${ticketPrice.toFixed(2)} each</span>
        </div>
        <div className="flex justify-between items-center mt-4 text-xl font-bold border-t pt-4">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>
      <button
        onClick={onConfirm}
        disabled={selectedSeats.length === 0}
        className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-lg text-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Confirm Booking
      </button>
    </div>
  );
};

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch event and seats when eventId changes
  useEffect(() => {
    const fetchEventAndSeats = async () => {
      if (!eventId) return;
      setLoading(true);
      try {
        const numericEventId = Number(eventId); // convert string to number

        // Fetch event
        const eventRes = await api.get(`/events/${numericEventId}`);
        setEvent(eventRes.data);

        // Fetch seats
        const seatsRes = await api.get(`/events/${numericEventId}/seats`);
        const sortedSeats = seatsRes.data.sort((a, b) => {
          const aRow = a.seatNumber[0];
          const bRow = b.seatNumber[0];
          const aNum = parseInt(a.seatNumber.substring(1));
          const bNum = parseInt(b.seatNumber.substring(1));
          if (aRow < bRow) return -1;
          if (aRow > bRow) return 1;
          return aNum - bNum;
        });
        setSeats(sortedSeats);
        setSelectedSeats([]); // reset selection when switching events
      } catch (err) {
        console.error(err);
        setError('Failed to load booking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndSeats();
  }, [eventId]);

  // Seat click handler
  const handleSeatClick = (seat) => {
    if (seat.booked) return;

    const alreadySelected = selectedSeats.find(s => s.id === seat.id);
    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Confirm booking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const userDetailsResponse = await api.get('/users/me');
      const currentUser = userDetailsResponse.data;

      const bookingData = {
        user: { id: currentUser.id },
        event: { id: event.id },
        seatsBooked: selectedSeats.map(s => ({ id: s.id })),
        status: 'BOOKED',
        bookingDate: new Date().toISOString()
      };

      await api.post('/bookings', bookingData);
      alert('Booking successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Booking failed. Please try again.');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg container mx-auto text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2">{event?.title}</h1>
          <p className="text-center text-gray-500 mb-6">Tap on a seat to select it</p>

          <div className="w-full h-2 bg-black rounded-t-full mb-2 opacity-20"></div>
          <div
            className="w-4/5 mx-auto h-12 bg-gray-800 text-white font-bold flex items-center justify-center text-lg tracking-widest mb-8"
            style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
          >
            SCREEN
          </div>

          <div className="grid grid-cols-12 gap-2 md:gap-3 mx-auto max-w-2xl">
            {seats.map(seat => (
              <div
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                title={seat.seatNumber}
                className={`aspect-square flex items-center justify-center rounded-t-md text-xs font-semibold transition-transform duration-200 border-2
                  ${seat.booked
                    ? 'bg-gray-500 border-gray-600 text-gray-300 cursor-not-allowed'
                    : selectedSeats.some(s => s.id === seat.id)
                      ? 'bg-red-500 border-red-700 text-white scale-110 shadow-lg'
                      : 'bg-white border-gray-300 hover:bg-red-200 hover:border-red-400 cursor-pointer'
                  }`}
              ></div>
            ))}
          </div>
          <SeatLegend />
        </div>

        <div className="lg:col-span-1">
          <BookingSummary event={event} selectedSeats={selectedSeats} onConfirm={handleBooking} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
