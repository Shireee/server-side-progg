require('dotenv').config()
const pgp = require('pg-promise')({})
const cn = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = pgp(cn)

function getTestimonials(){
    return db.any('SELECT * FROM comments.comments')
}

function postTestimonials(name, img_url, ocupation, title, description){
    return db.none('INSERT INTO comments.comments(name, img_url, ocupation, title, description) VALUES(${name}, ${img_url}, ${ocupation}, ${title}, ${description})', 
    {
        name: name,
        img_url: img_url,
        ocupation: ocupation,
        title: title,
        description: description
    })
}

module.exports = { getTestimonials, postTestimonials };