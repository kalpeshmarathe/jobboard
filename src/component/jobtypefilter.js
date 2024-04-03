import React, { useState } from 'react';

const FilterJobs = ({ jobTypes, onFilter }) => {
  const [selectedJobType, setSelectedJobType] = useState('');

  const handleFilterChange = (e) => {
    const jobType = e.target.value;
    setSelectedJobType(jobType);
    onFilter(jobType);
  };

  return (
    <div className="my-4">
      <label htmlFor="jobTypeFilter" className="mr-2 font-semibold">Filter by Job Type:</label>
      <select id="jobTypeFilter" className="p-2 border rounded" value={selectedJobType} onChange={handleFilterChange}>
        <option value="">All</option>
        {jobTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterJobs;
