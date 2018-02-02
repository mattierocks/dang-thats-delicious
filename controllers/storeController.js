const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async(req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req, res) => {
    //1. query database for list of all stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async(req, res) => {
    // 1. find the store given the id
    const store = await Store.findOne({ _id: req.params.id });
    // 2. confirm they are owner of store
    // TODO
    // 3. render out the edit form so use can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async(req, res) => {
    // find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    // redirect them and tell them it worked
};