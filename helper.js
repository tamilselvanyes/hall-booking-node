import { client } from "./index.js";

export function createroom(room) {
  return client.db("b30wd").collection("hallrooms").insertOne(room);
}

export function bookroom(room) {
  return client.db("b30wd").collection("bookings").insertOne(room);
}

export function getRoomById(id) {
  return client.db("b30wd").collection("hallrooms").findOne({ room_id: id });
}

export function getBookingsForRoom(id) {
  return client
    .db("b30wd")
    .collection("bookings")
    .find({ room_id: id })
    .toArray();
}

export function getAllRoomDataWithBookings() {
  return client
    .db("b30wd")
    .collection("hallrooms")
    .aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "room_id",
          foreignField: "room_id",
          as: "bookings",
        },
      },
      { $project: { amenties: 0, _id: 0 } },
    ])
    .toArray();
}

export function getBookingData() {
  return client.db("b30wd").collection("bookings").find({}).toArray();
}
