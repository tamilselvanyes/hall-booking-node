# hall-booking-node

URL : https://hall-booking-myapp.herokuapp.com/

ENDPOINTS

**1. /createroom** POST
//API to create room 
//Eg: body of API 
// {"room_id":"7",
// "no_of_seats": "10",
// "amenties": { "kitchen": "true",
//                "TV": "true",
//                "hair_dyer": "true",
//                "ac": "true",
//                "essential_kit": "true"
//             },
// "price_per_hour": "2000"
// }


**2./bookroom** POST

//API to book room.
// Eg: body of booking request  /bookroom
// {
//   "room_id":"1",
//   "customer_name": "Ronaldo",
//   "date": "05/10/2022",
//   "start_time": "10:00",
//   "end_time": "12:00"
//   }


**3. GET : /getallroomsdata**
//API to list all the rooms with booked data


**4.GET : /getcustomerbookingdata**
//API to list all the rooms with booked data


