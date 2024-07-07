import moment from 'moment-timezone';
import tz_lookup from 'tz-lookup'; 

export const parseHours = (business) => {
  const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const nextDayToCheck = (dayOfWeek) => {
    return dayOfWeek < 6 ? dayOfWeek + 1 : 0;
  }

  const convertMomentDayToYelpDay = (day) => {
    return day === 0 ? 6 : day - 1;
    // 0 6
    // 1 0
    // 2 1
    // 3 2
    // 4 3
    // 5 4
    // 6 5
  }

  const timeZoneBusiness = tz_lookup(business.coordinates.latitude, business.coordinates.longitude);

  const now = moment().tz(timeZoneBusiness);
  const nowYelpDay = convertMomentDayToYelpDay(now.day());
  const nowTimeFormatted = `${now.format('HHmm')}`
  let openingMessage = '';

  const openingHours = business.hours[0]?.open; 
  if (!openingHours) return `No information`;
  // console.log({hours: business.hours, openingHours})
  const findOpeningBlock = (dayOfWeek) => {
    const openHoursThisDay = openingHours.filter(x => x.day === dayOfWeek);
    if (openHoursThisDay.length > 0) {
      if (openHoursThisDay.filter(open => open.day === nowYelpDay && open.start < nowTimeFormatted && open.end > nowTimeFormatted).length > 0) { // open right now
        
        // console.log(`${business.name} is open right now`);
        const currentOpeningBlock = openHoursThisDay
          .filter(open => open.day === nowYelpDay && open.start < nowTimeFormatted && open.end > nowTimeFormatted)[0];

        openingMessage = `Open until ${moment(currentOpeningBlock.end, 'HHmm').format('h:mm A')}`;
        business.hours.is_open_now = true;
        business.hours.open_info = {
          time: moment(currentOpeningBlock.end, 'HHmm').format('h:mm A'),
        }
  
        // openHoursThisDay.map(open => console.log({start: open.start, end: open.end}));
      } else if (openHoursThisDay.filter(open => open.day === nowYelpDay && open.start > nowTimeFormatted).length > 0) { // open later today
        
        // console.log(`${business.name} is open later today`);
        
        const currentOpeningBlock = openHoursThisDay
          .filter(open => open.day === nowYelpDay && open.start > nowTimeFormatted)
          .sort((a, b) => a.start - b.start)[0];

        openingMessage = `Opens at ${moment(currentOpeningBlock.start, 'HHmm').format('h:mm A')}`;
        business.hours.is_open_now = false;
        business.hours.open_info = {
          time: moment(currentOpeningBlock.start, 'HHmm').format('h:mm A'),
        }
  
        // openHoursThisDay.map(open => console.log({start: open.start, end: open.end}));
      } else if (openHoursThisDay.filter(open => open.day === nowYelpDay && open.end < nowTimeFormatted).length > 0 && !(openingHours.length === 1)) { // was open today, now closed
        
        // console.log(`${business.name} was open today but is now closed, will look on ${daysOfTheWeek[nextDayToCheck(dayOfWeek)]}`);

        // openHoursThisDay.map(open => console.log({start: open.start, end: open.end}));
        findOpeningBlock(nextDayToCheck(dayOfWeek));
      } else if (openHoursThisDay.filter(open => open.day === dayOfWeek) || openingHours.length === 1) { // open on another day
        
        // console.log(`${business.name} is not open today, but next open on ${daysOfTheWeek[dayOfWeek]}`);

        const currentOpeningBlock = openHoursThisDay
          .filter(open => open.day === dayOfWeek)
          .sort((a, b) => a.start - b.start)[0];
        
        const tomorrow = dayOfWeek === nextDayToCheck(nowYelpDay);
        openingMessage = `Opens ${tomorrow ? 'tomorrow' : daysOfTheWeek[dayOfWeek]} at ${moment(currentOpeningBlock.start, 'HHmm').format('h:mm A')}`;
        business.hours.is_open_now = false;
        business.hours.open_info = {
          day: tomorrow ? 'tomorrow' : daysOfTheWeek[dayOfWeek],
          time: moment(currentOpeningBlock.start, 'HHmm').format('h:mm A'),
        }

        // openHoursThisDay.map(open => console.log({start: open.start, end: open.end}));
      } else { // not open on this day, look for next day
        // console.log(`${business.name} is not open on ${daysOfTheWeek[dayOfWeek]}, will continue looking`);
        findOpeningBlock(nextDayToCheck(dayOfWeek));
      }
    } else { // not open on this day, look for next day
      // console.log(`${business.name} is not open on ${daysOfTheWeek[dayOfWeek]}, will continue looking`);
      findOpeningBlock(nextDayToCheck(dayOfWeek));
    }
  }
  
  findOpeningBlock(convertMomentDayToYelpDay(now.day())); // moment day 0 is Sunday, Yelp day 0 is Monday
  return { openingMessage, hours: business.hours };
}

export const hexToRgba = (hex, alpha = 1) => {
  // Remove # if it's included
  hex = hex.replace('#', '');

  // Parse hex components
  let r, g, b;
  if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
  } else {
      throw new Error('Invalid hex color format');
  }

  // Validate alpha
  if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
  }

  // Return rgba value
  return `rgba(${r},${g},${b},${alpha})`;
}