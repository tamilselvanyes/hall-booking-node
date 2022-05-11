import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import {
  createroom,
  bookroom,
  getRoomById,
  getBookingsForRoom,
  getAllRoomDataWithBookings,
  getBookingData,
} from "./helper.js";

const app = express();
dotenv.config();

//middleware --> Intercept  --> Body to JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

export const client = await createConnection();

app.get("/", function (req, res) {
  res.send("This is backend of hall booking service");
});

//HALL BOOKING  INFORMATION STARTS HERE

//API to create room
//Eg: body of API  /createroom
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

app.post("/createroom", async (req, res) => {
  const data = req.body;
  //before adding a room we have to check whether the same room is already present or not
  let already_existing = await getRoomById(data.room_id);
  if (already_existing) {
    res.send({ message: "Room already exists" });
    return;
  }
  const response = await createroom(data);

  res.send(response);
});

//API to book room.
// Eg: body of booking request  /bookroom
// {
//   "room_id":"1",
//   "customer_name": "Ronaldo",
//   "date": "05/10/2022",
//   "start_time": "10:00",
//   "end_time": "12:00"
//   }

app.post("/bookroom", async (req, res) => {
  const data = req.body;

  //first check if the room exists or not
  const room = await getRoomById(data.room_id);
  if (room === null) {
    res.send({ message: "Room not found" });
    return;
  }
  //before booking a room we should check whether the room is available for the particular time.
  //  1. check the room id, if there is any booking for the rooms

  const bookings_of_room = await getBookingsForRoom(data.room_id);

  if (bookings_of_room != null) {
    //  2. check the date
    for (let i = 0; i < bookings_of_room.length; i++) {
      if (bookings_of_room[i].date === data.date) {
        //  3. check the time, check whether the start time lies between the start time and
        // the end time of the previous bookings

        if (IsTimeoverlap()) {
          res.send({ message: "Bookings for the Respective time is closed " });
          return;
        }

        function gethours(date) {
          return date.getHours(); // gives the hour of the date
        }

        function getDate(string) {
          return new Date(string);
        }

        function IsTimeoverlap() {
          if (
            (gethours(getDate(`${data.date}, ${data.start_time}`)) <
              gethours(
                getDate(`${data.date}, ${bookings_of_room[i].start_time}`)
              ) &&
              gethours(getDate(`${data.date}, ${data.end_time}`)) <
                gethours(
                  getDate(`${data.date}, ${bookings_of_room[i].start_time}`)
                )) ||
            gethours(getDate(`${data.date}, ${data.start_time}`)) >
              gethours(
                getDate(`${data.date}, ${bookings_of_room[i].end_time}`)
              ) ||
            gethours(getDate(`${data.date}, ${data.end_time}`)) >
              gethours(
                getDate(`${data.date}, ${bookings_of_room[i].end_time} `)
              )
          ) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }

  const response = await bookroom(data);
  res.send(response);
});

//API to list all the rooms with booked data
//GET : /getallroomsdata

app.get("/getallroomsdata", async (req, res) => {
  const response = await getAllRoomDataWithBookings();
  res.send(response);
});

//API to list all the rooms with booked data
//GET : /getcustomerbookingdata

app.get("/getcustomerbookingdata", async (req, res) => {
  const response = await getBookingData();
  res.send(response);
});

app.listen(PORT, () => console.log(`Server started ${PORT}`));

//Very important code for mongo connection always just as it is.......

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌️😊");
  return client;
}
