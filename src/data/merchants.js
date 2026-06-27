// Each merchant config represents the page you land on after scanning that
// merchant's QR code. The form is rendered generically from `fields`, so adding
// a new QR/merchant is just a matter of adding another entry here.

const currentYear = 2026;
const startYears = Array.from({ length: 8 }, (_, i) => String(currentYear - i + 2));

export const merchants = {
  // ---- Form Type A: IPS College "Student Fee Collection" ----
  ips: {
    id: "ips",
    logo: "🏛️",
    eyebrow: "PAY",
    name: "IPS COLLEGE OF TECHNICAL EDUCATION",
    subtitle: "Fee Collection",
    layout: "hero", // big merchant header
    formTitle: "Student Fee Collection",
    fields: [
      {
        name: "studentName",
        label: "Student's Name",
        placeholder: "Student's Name*",
        type: "text",
        required: true,
      },
      {
        name: "fatherName",
        label: "Father's Name",
        placeholder: "Father's Name*",
        type: "text",
        required: true,
      },
      {
        name: "course",
        label: "Select Course",
        placeholder: "Select Course*",
        type: "select",
        required: true,
        helper: "Enter your course name",
        options: ["BBA", "BCA", "B.Tech", "B.Com", "MBA", "MCA", "Other"],
      },
      {
        name: "courseOther",
        label: "Enter course name if Other",
        placeholder: "Enter course name if Other",
        type: "text",
        helper: "Mention Course name if selected Other",
        // only required/visible when course === "Other"
        showWhen: { field: "course", equals: "Other" },
        requiredWhen: { field: "course", equals: "Other" },
      },
      {
        name: "startYear",
        label: "Course Start Year",
        placeholder: "Course Start Year*",
        type: "select",
        required: true,
        helper: "Select your course start year",
        options: startYears,
      },
      {
        name: "amount",
        label: "Enter Amount",
        placeholder: "Enter amount",
        type: "amount",
        required: true,
      },
    ],
    proceedLabel: "Proceed to Pay",
  },

  // ---- Form Type B: Aakash "Fee Payment" (PSID based) ----
  aakash: {
    id: "aakash",
    logo: "📘",
    layout: "help", // help bar header
    headerTitle: "Aakash Fee Payment",
    formTitle: "Enter Details",
    boxed: true, // wraps the fields in a bordered "Enter Details" card
    fields: [
      {
        name: "psid",
        label: "PSID",
        placeholder: "Enter 11 digit PSID",
        type: "text",
        inputMode: "numeric",
        required: true,
        // 11-digit validation as seen in the screenshot
        pattern: /^\d{11}$/,
        errorMessage: "Please enter a valid 11 digit PSID",
      },
      {
        name: "rollNo",
        label: "Roll Number",
        placeholder: "Enter Roll Number",
        type: "text",
        inputMode: "numeric",
        required: true,
      },
      {
        name: "amount",
        label: "Fee Amount",
        placeholder: "Enter amount",
        type: "amount",
        required: true,
      },
    ],
    terms: true,
    proceedLabel: "Proceed",
  },
};

export const merchantList = Object.values(merchants);

export function getMerchant(id) {
  return merchants[id] || null;
}
