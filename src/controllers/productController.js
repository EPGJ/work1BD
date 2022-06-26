const connection = require('../utils/databaseConnection');

module.exports = {

    async index(req, res) {

        await connection.query(`
            select product.id, product.category_id,product.name, category.name as category, product.price, product.restaurant_id from product
            join category on product.category_id = category.id
            ;   
        `).then(response => res.json(response[0]))
        .catch(err => res.json(err.original.sqlMessage));

    },

    async getProduct(req, res) {

        const { idProduct } = req.params;

        let product, promotions;

        await connection.query(`
            select product.id,product.name, category.name as category, product.price, product.restaurant_id, promotion.description, promotion.price as promotionalPrice, promotion.schedule from product
            join category on product.category_id = category.id
            join promotion on promotion.product_id = product.id 
            where isActive=${true} and product_id=${idProduct}; 
        `)
        .then( response => {
            product = response[0][0];
            promotions = response[0].map(promotion => {
                return {
                    description: promotion.description,
                    promotionalPrice: promotion.promotionalPrice,
                    schedule: promotion.schedule
                }
            });

            return res.json({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                restaurant_id: product.restaurant_id,
                promotions: promotions  
            })
        })
        .catch(err => res.json(err));



    },

    async store(req, res){

        const { category_id, name, price, restaurant_id } = req.body

        await connection.query(`
            insert into product (category_id, name, price, restaurant_id)
            values (${category_id}, '${name}', ${price}, ${restaurant_id});  
        `)
        .then(response => res.json(response[0]))
        .catch(err =>  res.json(err.original.sqlMessage));
    },

    async setPromotion(req, res) {

        const { description, price, isActive, product_id, schedule } = req.body;

        await connection.query(`
            insert into promotion (description, price, isActive, product_id, schedule )
            values ( '${description}', ${price}, ${isActive}, ${product_id}, '${schedule}' )
        `)
        .then(response => res.json(response[0]))
        .catch(err =>  res.json(err.original.sqlMessage));

    },

    async update(req, res) {

        const { idRestaurant} = req.params;
        const { name, price } = req.body;

        await connection.query(`
            update product
            set name = '${name}' , price = ${price}
            where id = ${idRestaurant};
        `)
        .then(response => res.json(response[0]))
        .catch(err => res.json(err.original.sqlMessage));

    },


    async destroy(req, res){
        
        const {idRestaurant} = req.params;

        await connection.query(`
            delete from product
            where id = ${idRestaurant}
        `)
        .then(response => res.json(response[0]))
        .catch(err => res.json(err.original.sqlMessage));
    },


};