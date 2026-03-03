exports.getStatus = (req, res) => {
  res.json({
    status: "Online",
    message: "AWS Backend is reachable!",
    owner: "Tremain Mannion",
    timestamp: new Date()
  });
};