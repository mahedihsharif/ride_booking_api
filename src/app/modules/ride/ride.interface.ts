// {
//   _id: ObjectId;
//   rider: ObjectId (ref: 'User');
//   driver: ObjectId (ref: 'User');
//   pickupLocation: {
//     address: string;
//     lat: number;
//     lng: number;
//   };
//   destinationLocation: {
//     address: string;
//     lat: number;
//     lng: number;
//   };
//   fare: number;
//   status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
//   timestamps: {
//     requestedAt: Date;
//     acceptedAt?: Date;
//     pickedUpAt?: Date;
//     completedAt?: Date;
//     cancelledAt?: Date;
//   };
// }
