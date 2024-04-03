import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: currentPage }), // Pass the current page number to the API
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFilter = () => {
    let filtered = jobs;
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.Location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (titleFilter) {
      filtered = filtered.filter(job =>
        job.JobTitle.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  };

  const resetFilters = () => {
    setLocationFilter('');
    setTitleFilter('');
    setFilteredJobs(jobs);
  };

  const totalPages = Math.ceil(filteredJobs.length / 10);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by title..."
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r hover:bg-gray-400 transition duration-300"
        >
          Reset Filters
        </button>
      </div>
      <ul>
        {filteredJobs.slice((currentPage - 1) * 5, currentPage * 5).map(job => (
          <li
            key={job.JobID}
            className="border-b border-gray-300 py-4 flex items-center justify-between"
          >
            <div>
              <strong className="text-lg font-semibold">
                {job.JobTitle}
              </strong>
              <p className="text-gray-600 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                {job.Location}
              </p>
              <p className="text-gray-600">{job.Description}</p>
              <p className="text-gray-600 flex items-center">
                <FontAwesomeIcon icon={faMoneyBillAlt} className="mr-1" />
                ${job.Salary}
              </p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
              Apply Now
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-2 px-3 py-1 rounded-full ${
              index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
