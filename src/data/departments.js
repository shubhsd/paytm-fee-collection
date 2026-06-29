// Entities a payment can be directed to. Shared by both flows' dropdowns —
// edit this list to add/rename entities in one place.
export const ENTITIES = [
  "Jalandhar Development Authority",
  "GMADA",
  "Municipal Corporation",
  "Water Resource Department, Punjab",
  "Pension Labour Department",
  "Housing & Urban Development Department",
  "Greater Ludhiana Area Development Authority",
];

// The two services shown on the home screen.
export const SERVICES = [
  {
    id: "dept",
    title: "Punjab Labour Department",
    sub: "Pay directly — enter your details",
    icon: "🏛️",
    to: "/dept/form",
  },
  {
    id: "dept1",
    title: "Punjab Labour Department 1",
    sub: "Log in with Customer ID / Mobile",
    icon: "🔐",
    to: "/login",
  },
];
