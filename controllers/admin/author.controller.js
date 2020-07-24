const AuthorModel = require('../../models/AuthorModel');
const authUtils = require('../../utils/authUtils.js');
const authorUtils = require('../../utils/authorUtils.js');
const validation = require('../../validation/admin/validateAuthor');

module.exports = {
    showAuthorList: 
    async (req, res) => {

        res.render(
            'admin/author/author_base', {
                header: 'List of authors',
                content: 'authors',
                authors: await authorUtils.getAuthorsWithNumOfArticles(),
                information: authUtils.getAdminProfile(req)
            });
    },

    showAddAuthorForm: (req, res) => {
        res.render(
            'admin/author/author_base', {
                header: 'Add new author',
                content: 'add',
                information: authUtils.getAdminProfile(req)
            });
    },

    addAuthor: [
        validation.add, 
        async (req, res) => {
            const {
                hasError,
                errors,
                validInput
            } = validation.result(req);
    
            if (hasError) {
                return res.render(
                    "admin/author/author_base", {
                        errors: errors,
                        validInput: validInput,
                        header: 'Add new author',
                        content: 'add',
                        information: authUtils.getAdminProfile(req)
                    });
            };
    
            try {
                const author = await authorUtils.createNewAuthor({
                    username: req.body.username,
                    email: req.body.email,
                    pwd: req.body.password
                });
    
                if (author) {
                    req.flash("success", "Successfully. A new author was added.");
                } else {
                    req.flash("fail", "Failed. An error occurred during the process.");
                }
    
                return res.redirect("/admin/authors/add");
            } catch (error) {
                return res.render(
                    "error/admin-404", {
                        redirectLink: '/admin/authors'
                    }
                );
            }
        }
    ],

    showUpdateAuthorForm: async (req, res) => {
        try {
            const author = await AuthorModel.findOne({
                username: req.params.username
            });

            if (author) {
                return res.render(
                    "admin/author/author_base", {
                        author: author,
                        header: 'Update new author',
                        content: 'update',
                        information: authUtils.getAdminProfile(req)
                    });
            }

            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        }
    },

    updateAuthor: [
        validation.update,
        async (req, res) => {
            try {
                const author = await AuthorModel.findOne({
                    username: req.params.username
                });
                if (author) {

                    const {
                        hasError,
                        errors,
                        validInput
                    } = validation.result(req);

                    if (hasError) {
                        return res.render(
                            "admin/author/author_base", {
                                errors: errors,
                                validInput: validInput,
                                header: 'Update new author',
                                content: 'update',
                                author: author,
                                information: authUtils.getAdminProfile(req)
                            });
                    };


                    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
                        author.id, {
                            username: req.body.username,
                            email: req.body.email
                        }, {
                            new: true
                        }); // Return the updated object

                    if (updatedAuthor) {
                        req.flash('success', 'Successfully. All changes were saved.');
                        return res.redirect("/admin/authors/update/" + updatedAuthor.username);
                    } else {
                        req.flash('fail', 'Failed. An error occurred during the process.');
                        return res.redirect("/admin/authors/update/" + author.username);
                    }

                }

                return res.render(
                    "error/admin-404", {
                        redirectLink: '/admin/authors'
                    }
                );
            } catch (error) {
                return res.render(
                    "error/admin-404", {
                        redirectLink: '/admin/authors'
                    }
                );
            }
        }
    ],

    activateAuthor: async (req, res) => {
        try {
            const author = await AuthorModel.findOneAndUpdate({
                $and: [{
                    _id: req.body.id
                }, {
                    status: 'Deactivated'
                }]
            }, {
                status: 'Activated'
            });

            if (author) {
                req.flash("success", "Successfully. The status was changed to 'Activated'");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/authors");
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        }
    },

    deactivateAuthor: async (req, res) => {
        try {
            const author = await AuthorModel.findOneAndUpdate({
                $and: [{
                    _id: req.body.id
                }, {
                    status: 'Activated'
                }]
            }, {
                status: 'Deactivated'
            });
            if (author) {
                req.flash("success", "Successfully. The status was changed to 'Deactivated'");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/authors");
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        }
    },

    resetPassword: async (req, res) => {
        try {
            const author = await AuthorModel.findOneAndUpdate({
                $and: [{
                    _id: req.body.id
                }, {
                    password: {
                        $ne: 'Reset Password'
                    }
                }]
            }, {
                password: 'Reset Password'
            });

            if (author) {
                req.flash("success", "Successfully. A link was sent to email for setting up a new password.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect("/admin/authors");
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        }
    },

    deleteAuthor: async (req, res) => {
        try {
            const author = await AuthorModel.findByIdAndDelete(req.body.id);

            if (author) {
                req.flash("success", "Successfully. The author was removed from the database.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process");
            }
            return res.redirect("/admin/authors");
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/authors'
                }
            );
        }
    }
}