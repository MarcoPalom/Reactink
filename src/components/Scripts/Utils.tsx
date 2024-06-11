import React from 'react';
const TodayDate = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  return (
  <h1>{formattedDate}</h1>
  )
};

export default TodayDate;

