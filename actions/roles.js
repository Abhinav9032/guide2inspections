const defaultRoles = [
  { role: "Engine Room", isAllowed: true },
  { role: "Bridge", isAllowed: false },
  { role: "LSA FFA", isAllowed: true },
  { role: "Pumproom", isAllowed: false },
  { role: "Upper Deck", isAllowed: false },
  { role: "Forecastle", isAllowed: false },
  { role: "Atf Poop Deck", isAllowed: false },
  { role: "Accomodation", isAllowed: false },
  { role: "CCR", isAllowed: false },
  { role: "Hospital", isAllowed: false },
  { role: "Galley", isAllowed: false },
  { role: "Emergency Head Quaters", isAllowed: false },
  { role: "Deck Documentation", isAllowed: true },
  { role: "Engine Documentation", isAllowed: false },
  { role: "Security", isAllowed: false },
];

const getSectionName = (sectionId) => {
  if (sectionId == 1) return "Engine Room";
  if (sectionId == 2) return "Engine Documentation";
  if (sectionId == 3) return "Bridge";
  if (sectionId == 4) return "LSA FFA";
  if (sectionId == 5) return "Accomodation";
  if (sectionId == 6) return "Galley";
  if (sectionId == 7) return "Hospital";
  if (sectionId == 8) return "Aft Poop Deck";
  if (sectionId == 9) return "Forecastle";
  if (sectionId == 10) return "Upper Deck";
  if (sectionId == 11) return "CCR";
  if (sectionId == 12) return "Deck Documentation";
  if (sectionId == 13) return "Emergency Head Quarters";
  if (sectionId == 14) return "Master's Documentation";
  if (sectionId == 15) return "Pumproom";
  if (sectionId == 16) return "Security";
};

module.exports = { defaultRoles, getSectionName };
