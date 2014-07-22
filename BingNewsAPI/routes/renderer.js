exports.index = function (req, res) {
    res.render('index', {key:process.env.API_KEY});
}

exports.settings = function (req, res) {
    res.render('settings', {key:process.env.API_KEY});
}