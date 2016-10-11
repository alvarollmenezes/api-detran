module.exports = {
    max: process.env.API_MAX || 300,
    duration: process.env.API_DURATION_MIN || 10,
    perSecond: process.env.API_PER_SECOND || false,
    max2: process.env.API_MAX_2 || 10,
    duration2Sec: process.env.API_DURATION_SEC_2 || 10,
    perSecond2: process.env.API_PER_SECOND_2 || false
};
