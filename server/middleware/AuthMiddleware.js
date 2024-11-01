const {verify} = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) return res.status(403).json({error: "User not logged in!"});
    
    try {
        const validToken = verify(accessToken, "WSoLeXRHwLYJsMBDyfrW");
        req.user = validToken;

        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.status(403).json({error: err});
    }
};

module.exports = { validateToken };


