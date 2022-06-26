const connection = require('../utils/databaseConnection');
const { handleSchedule, parseSchedule } = require('../utils/handleSchedules');

module.exports = {

    async index(req, res) {

        await connection.query(`
            select * from restaurant
            join address on restaurant.address_id = address.id
            ;   
        `)
        .then(response => {
            let restaurants = response[0];
            restaurants.forEach(async restaurant => {
                response = await connection.query(`
                    select * from schedule
                    where restaurant_id = ${restaurant.id}
                `)
                console.log(response)

                restaurant.schedule = response[0];
            });

            return res.json(restaurants);
        })
        .catch(err => res.json(err.original.sqlMessage));

        

    },

    async getRestaurant(req, res) {
        const { id } = req.params;

        let restaurant, schedules;
        
        await connection.query(`
            select * from restaurant
            join address on restaurant.address_id = address.id
            join schedule on restaurant.id = schedule.restaurant_id
            where restaurant.id = ${id};
        `).then(response => {
            restaurant = response[0][0]
            schedules = response[0].map(schedule => {
                return {
                    day: schedule.day_id,
                    openTime: schedule.openTime,
                    closeTime: schedule.closeTime
                }
    
            })

            const scheduleStr = handleSchedule(schedules);

            return res.json({
                id: restaurant.restaurant_id,
                name: restaurant.name,
                photography: restaurant.photography,
                street: restaurant.street,
                number: restaurant.number,
                postalCode: restaurant.postalCode,
                district: restaurant.district,
                schedules: scheduleStr
            }); 
        })
        .catch(err => res.json(err));
    },

    async getAllRestaurantProducts(req, res) {

        const { id } = req.params;

        const response = await connection.query(`
            select product.id, product.category_id,product.name, category.name as category, product.restaurant_id from product
            join category on product.category_id = category.id
            where product.restaurant_id=${id}
            ;   
        `).catch(err => res.json(err.original.sqlMessage));

        return res.json(response[0]);
    },

    async store(req, res) {
     
        const { street, number, postalCode, district } = req.body;

        const addressResponse = await connection.query(`
            insert into address (street, number, postalCode, district)
            values ('${street}', ${number}, '${postalCode}', '${district}');
        `).catch(err => res.json(err.original.sqlMessage));

        const addressId = addressResponse[0];
        const { name, photography } = req.body;

        const restaurantResponse = await connection.query(`
            insert into restaurant (name, photography, address_id) values ('${name}', '${photography}', '${addressId}');
        `).catch(err => res.json(err.original.sqlMessage));

        const restaurantId = restaurantResponse[0];
        const { schedules } = req.body;

        let scheduleValues = parseSchedule(schedules, restaurantId);


        await connection.query(`
            insert into schedule (day_id, openTime, closeTime, restaurant_id) values 
            ${scheduleValues};
        `).catch(err => res.json(err.original.sqlMessage));

        return res.json(restaurantResponse[0]);
        
    },

    async uploadFile(req, res) {
        const { id } = req.params;
        const photography  = req.file.filename;
        
        await connection.query(`

            update restaurant
            photography = '${photography}'
            where id = ${id};

        `).catch(err => res.json(err.original.sqlMessage));

        return res.status(200).json({'message': 'File uploaded successfully'});
    },


    async update(req, res) {

        const { id } = req.params;
        const { name, photography, street, number, postalCode, district } = req.body;

        await connection.query(`

            update restaurant
            set name = '${name}', photography = '${photography}'
            where id = ${id};

        `)
        
        const addressResponse = await connection.query(`
            update address
            set street = '${street}', number = ${number}, postalCode = '${postalCode}', district = '${district}'
            where id = (select address_id from restaurant where id = ${id});
        `)

        const { schedules } = req.body;


        schedules.forEach(async schedule => {
            await connection.query(`
                update schedule
                set day_id = ${schedule.day}, openTime = '${schedule.openTime}', closeTime = '${schedule.closeTime}'
                where day_id = ${schedule.day};
            `)
        });



        return res.json(addressResponse[0]);
    },


    async destroy(req, res) {

        const { id } = req.params;

        await connection.query(`
            delete from address
            where id = (select address_id from restaurant where id = ${id});
        `)

        const response = await connection.query(`
            delete from restaurant
            where id = ${id};
        `);

        return res.json(response);
    }


};