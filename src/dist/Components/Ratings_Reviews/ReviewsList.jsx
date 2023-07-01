import React from 'react';
import ReviewEntry from './ReviewEntry.jsx';
import Box from '@mui/material/Box';

let ReviewsList = ({shownReviews}) => {
  //console.log('reviews', shownReviews);

  return (
  <Box sx={{maxHeight: '65vh', overflow: 'auto', borderRadius: '4px'}}>
    {shownReviews.map((review, i) => (
      <ReviewEntry key={i} review={review}/>
    ))}
  </Box>);
};

export default ReviewsList;