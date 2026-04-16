const BookingUtil = {
  getTotal(mybookings) {
    return mybookings.reduce((sum, item) => sum + item.total, 0);
  }
};
export default BookingUtil;
