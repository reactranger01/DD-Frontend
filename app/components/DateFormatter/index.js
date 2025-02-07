import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DateFormatter = ({ dateTime }) => {
  const [formatDate, setFormatDate] = useState('');
  const formattedInputDate = moment(dateTime);
  const today = moment();

  useEffect(() => {
    if (today.isSame(formattedInputDate, 'day')) {
      const formattedTime = formattedInputDate.format('hh:mm A');
      setFormatDate(`Today, ${formattedTime}`);
    } else {
      const formattedDate = formattedInputDate.format('DD MMM');
      const formattedTime = formattedInputDate.format('hh:mm A');
      setFormatDate(`${formattedDate}, ${formattedTime}`);
    }
  }, [formattedInputDate, today]);

  return (
    <>
      <span className="text-12 text-[#2C286A] hidden md:inline">
        {formatDate}{' '}
      </span>

      {/* For tab and mobile */}

      <span className="text-12 leading-[14px] inline md:hidden">
        {formatDate.split(',')[0]}
      </span>
      <span className="text-10 leading-[12px] inline md:hidden">
        {formatDate.split(',')[1]}
      </span>
    </>
  );
};
DateFormatter.propTypes = {
  dateTime: PropTypes.string,
};
export default DateFormatter;
