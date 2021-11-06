
const handleRegister = (req, res, db, bcrypt)=> {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password);

    if(!name.length || !email.length || !password.length)
    {   
        res.status(400).json("Please enter all fields");
        return;
    }

    if(!email.includes('@'))
    {
        res.status(400).json("Please enter valid email address");
        return;
    }

    if(password.length < 6)
    {
        res.status(400).json("Password must be atleast six characters long");
        return;
    }

    // whenever we are updating a table but it should also be updated in another
    // table we use transactions so that inconsistencies don't occurr.

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users').returning('*')
            .insert({  // id is auto increment (serial) and entries is by default 0
                name: name,
                email: loginEmail[0],
                joined: new Date()
            }).then(user => {
                res.json(user[0])   // returns an array of size 1 actually, so
            })
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback;
            res.status(400).json("Email already registered");
        })
    }).catch(err => res.status(400).json("Error"))
}

module.exports = {
    handleRegister: handleRegister
};