import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = null, buttonText }) => {
  const [event, setEvent] = useState({ title: '', description: '', venue: '', dateTime: '', price: 0, totalSeats: 0 });

  useEffect(() => {
    if (initialData && initialData.id) {
      setEvent({
        title: initialData.title || '',
        description: initialData.description || '',
        venue: initialData.venue || '',
        dateTime: initialData.dateTime ? initialData.dateTime.substring(0, 16) : '',
        price: initialData.price || 0,
        totalSeats: initialData.totalSeats || 0,
      });
    } else {
      setEvent({ title: '', description: '', venue: '', dateTime: '', price: 0, totalSeats: 0 });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" value={event.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={event.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Venue</label>
        <input type="text" name="venue" value={event.venue} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date and Time</label>
        <input type="datetime-local" name="dateTime" value={event.dateTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>
       <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" name="price" step="0.01" value={event.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                <input type="number" name="totalSeats" value={event.totalSeats} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">{buttonText}</button>
    </form>
  );
};

export default EventForm;