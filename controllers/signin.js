/*
    1. Find the guy's email in the login table
    2. match the passwords
    3. if email doesn't exist or passwords don't match give out error

*/
// always start by checking what the queries return by console logging them
// and also using postman
const handleSignin = (req, res, db, bcrypt)=> {
    const {email, password} = req.body;
    db.select('email','hash').from('login').where({
        email: email
    }).then(response => {
        if(response.length) {    // email found
            if(bcrypt.compareSync(password, response[0].hash))  // password is correct
            {
                db.select('*').from('users').where({
                    email: email
                }).then(response => {
                    res.json(response[0]);
                }).catch(err => res.status(500).json(0))
            }
            else    // incorrect password enterd
                res.status(400).json("Password is incorrect");
        } else {    // email not found
            res.status(400).json("Email is not registered");
        }
    }).catch(err => {
        res.status(400).json("Cannot sign in")
    });
}

module.exports = {
    handleSignin: handleSignin
}