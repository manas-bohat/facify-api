const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '64d073fe8eb74a5ebe1a0bae97b65db0'
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
    let { id } = req.body;      
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(response => {
        // console.log(response[0]);
        res.json(response[0]);  // response gives array of size 1 with new number of entries
    }).catch(err => {
        res.status(400).json("Error");
    })
}

module.exports = {
    handleImage,
    handleApiCall
}