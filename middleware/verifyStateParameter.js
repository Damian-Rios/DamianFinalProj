// Array of valid state codes
const validStateCodes = [
  'AL', 'AK', 'AZ', 'AR', 'CA',
  'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO',
  'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY'
];

// Middleware function to verify and normalize the state parameter
const verifyStateParameter = (req, res, next) => {
  const stateCode = req.params.state.toUpperCase();
  if (validStateCodes.includes(stateCode)) {
    req.normalizedStateCode = stateCode;
    next();
  } else {
    res.status(400).json({ error: 'Invalid state code' });
  }
};

module.exports = verifyStateParameter;
