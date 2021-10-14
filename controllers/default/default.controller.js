module.exports = {
    home: (req, res) => {
        let pageTitle = "home page";
        res.render('default/index', {pageTitle});
    },
}