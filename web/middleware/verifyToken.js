import jwt from "jsonwebtoken"

export default function verify(req, resp, next) {
    if (req.headers.token) {
        const extraDetails = jwt.decode(req.headers.token)
        jwt.verify(req.headers.token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                console.log("user not found")
                resp.status(403).json("Token is not valid")
                return
            };
            if (user) {
                req.user = { ...user, ...extraDetails };
                next();
            }
        })
    }
    else {
        return resp.status(401).json("You are not authorised")
    }
}