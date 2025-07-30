function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateDistanceInKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = deg2rad(to.lat - from.lat);
  const dLng = deg2rad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(from.lat)) *
      Math.cos(deg2rad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
