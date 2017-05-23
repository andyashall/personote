const randomID = require('random-id')
const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (app, url, MongoClient, assert) => {

    app.get('/api/getnote', (req, res) => {
        let userId = req.query.uid,
        	nid = req.query.nid
    	if (!userId) {
    		res.send("Not logged in")
    		return
    	}
        MongoClient.connect(url)
        .then((db,err) => {
        	assert.equal(null,err)
        	let Notes = db.collection('notes')
        	Notes.findOne({$and: [{_id: nid}, {user: userId}]}, (err, note) => {
        		if (err) {
        			res.send(err)
        		}
        		if (note) {
        			res.send(note)
        		}
        	})
        })
        .catch((err) => {
        	res.send(err)
        	return
        })
    })

    app.get('/api/getnotes', (req, res) => {
        let userId = req.query.uid
    	if (!userId) {
    		res.send("Not logged in")
    		return
    	}
        MongoClient.connect(url)
        .then((db,err) => {
        	assert.equal(null,err)
        	let Notes = db.collection('notes')
        	Notes.find({$and: [{user: userId}, {archived: false}]}, {sort: {updated: -1}}).limit(10).toArray((err, notes) => {
        		if (err) {
        			res.send(err)
        		}
        		if (notes) {
        			res.send(notes)
        		}
        	})
        })
        .catch((err) => {
        	res.send(err)
        	return
        })
    })

    app.get('/api/getarchive', (req, res) => {
        let userId = req.query.uid
        if (!userId) {
            res.send("Not logged in")
            return
        }
        MongoClient.connect(url)
        .then((db,err) => {
            assert.equal(null,err)
            let Notes = db.collection('notes')
            Notes.find({$and: [{user: userId}, {archived: true}]}, {sort: {updated: -1}}).toArray((err, notes) => {
                if (err) {
                    res.send(err)
                }
                if (notes) {
                    res.send(notes)
                }
            })
        })
        .catch((err) => {
            res.send(err)
            return
        })
    })

    app.post('/api/newnote', (req, res) => {
    	console.log(req.body)
    	let title = req.body.title,
    		content = req.body.content,
            prev = req.body.preview,
    		nid = randomID(20),
    		userId = req.body.userId
    	if (!userId) {
    		res.send("Not logged in")
    		return
    	}
    	MongoClient.connect(url)
    	.then((db,err) => {
    		assert.equal(null,err)
    		let Notes = db.collection('notes')
    		Notes.insertOne({
    			title: title,
    			content: content,
                preview: prev,
    			created: new Date(),
    			updated: new Date(),
    			_id: nid,
    			user: userId,
                archived: false
    		}, (err, result) => {
    			if (err) {
    				res.send(err)
    			}
    			if (result) {
    				let data = {
    					nid: nid
    				}
    				res.send(data)
    			}
    		})
    	})
    })

    app.post('/api/savenote', (req, res) => {
    	console.log(req.body)
    	let title = req.body.title,
    		content = req.body.content,
            prev = req.body.preview,
    		nid = req.body.nid,
    		userId = req.body.userId
    	if (!userId) {
    		res.send("Not logged in")
    		return
    	}
    	MongoClient.connect(url)
    	.then((db,err) => {
    		assert.equal(null,err)
    		let Notes = db.collection('notes')
    		Notes.updateOne({_id: nid}, {$set: {
    			title: title,
    			content: content,
                preview: prev,
    			updated: new Date()
    		}}, (err, result) => {
    			if (err) {
    				res.send(err)
    			}
    			if (result) {
    				res.send(result)
    			}
    		})
    	})
    })

    app.post('/api/archivenote', (req, res) => {
        console.log(req.body)
        let nid = req.body.nid,
            userId = req.body.uid
        if (!userId) {
            res.send("Not logged in")
            return
        }
        MongoClient.connect(url)
        .then((db,err) => {
            assert.equal(null,err)
            let Notes = db.collection('notes')
            Notes.updateOne({$and: [{_id: nid}, {user: userId}]}, {$set: {
                archived: true
            }}, (err, result) => {
                if (err) {
                    res.send(err)
                }
                if (result) {
                    res.send(result)
                }
            })
        })
    })

    app.post('/api/unarchivenote', (req, res) => {
        console.log(req.body)
        let nid = req.body.nid,
            userId = req.body.uid
        if (!userId) {
            res.send("Not logged in")
            return
        }
        MongoClient.connect(url)
        .then((db,err) => {
            assert.equal(null,err)
            let Notes = db.collection('notes')
            Notes.updateOne({$and: [{_id: nid}, {user: userId}]}, {$set: {
                archived: false
            }}, (err, result) => {
                if (err) {
                    res.send(err)
                }
                if (result) {
                    res.send(result)
                }
            })
        })
    })

    app.post('/api/deletenote', (req, res) => {
        console.log(req.body)
        let nid = req.body.nid,
        userId = req.body.uid
        if (!userId) {
            res.send("Not logged in")
            return
        }
        MongoClient.connect(url)
        .then((db,err) => {
            assert.equal(null,err)
            let Notes = db.collection('notes')
            Notes.remove({$and: [{_id: nid}, {user: userId}]}, {justOne: true}, (err, result) => {
                if (err) {
                    res.send(err)
                }
                if (result) {
                    res.send(result)
                }
            })
        })
    })

    app.post('/api/signin', (req, res) => {
    	let email = req.body.email,
    		pass = req.body.pass
    	console.log('doot')
    	MongoClient.connect(url)
    	.then((db,err) => {
    		let Users = db.collection('users')
    		Users.findOne({email: email}, (err, user) => {
    			if (err) {
    				res.send("user not found")
    			}
    			if (user) {
    				let hash = user.password
    				console.log(hash)
    				bcrypt.compare(pass, hash, (err, result) => {
    					if (result) {
    						console.log(user)
    						let data = {
    							userId: user._id,
    							email: user.email
    						}
    						res.send(data)
    					} else {
    						res.send("Incorrect password")
    					}
    				})
    			}
    		})
    	})
    })

    app.post('/api/changepassword', (req, res) => {
        let userId = req.body.uid,
            pass = req.body.pass,
            newPass = req.body.newPass,
            conf = req.body.conf
        if (!userId) {
            res.send("Not logged in")
            return
        }
        if (newPass !== conf) {
            res.send("Passwords don't match")
            return
        }
        MongoClient.connect(url)
        .then((db,err) => {
            let Users = db.collection('users')
            Users.findOne({_id: userId}, (err, user) => {
                if (err) {
                    res.send("user not found")
                }
                if (user) {
                    let hash = user.password
                    console.log(hash)
                    bcrypt.compare(pass, hash, (err, result) => {
                        if (result) {
                            bcrypt.hash(newPass, saltRounds).then((hash) => {
                                assert.equal(null,err)
                                let Users = db.collection('users')
                                Users.updateOne({_id: userId}, {
                                    password: hash
                                }, (err, result) => {
                                    if (err) {
                                        res.send(err)
                                    }
                                    if (result) {
                                        res.send("Password Changed")
                                    }
                                })
                            })
                        } else {
                            res.send("Incorrect password")
                        }
                    })
                }
            })
        })
    })

    app.post('/api/signup', (req, res) => {
    	let email = req.body.email,
    		pass = req.body.pass
    	MongoClient.connect(url)
    	.then((db,err) => {
    		let Users = db.collection('users')
    		Users.findOne({email: email}, (err, user) => {
    			if (err) {
    				return
    			}
    			if (user) {
    				res.send({message: "A user with that email already exists"})
    			} else {
			    	bcrypt.hash(pass, saltRounds).then((hash) => {
			    		assert.equal(null,err)
			    		let Users = db.collection('users')
			    		Users.insertOne({
			    			email: email,
			    			password: hash,
			    			created: new Date()
			    		}, (err, result) => {
			    			if (err) {
			    				res.send(err)
			    			}
			    			if (result) {
			    				let data = {
			    					userId: result.insertedId,
			    					email: email
			    				}
			    				res.send(data)
			    			}
			    		})
			    	})
    			}
    		})
    	}) 	
    })

}