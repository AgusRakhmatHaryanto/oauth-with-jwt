const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateJwt = (user)=>{
    const token = jwt.sign({
        email: user.email
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn: "12h",
    });
    return token;
};

module.exports= {
    generateJwt
}