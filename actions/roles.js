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

//implement Map
const getSectionNameAndSeq = (sectionId) => {
  if (sectionId == 1) return { sectionName: "Engine Room", sectionSequence: 1 };
  if (sectionId == 2)
    return { sectionName: "Engine Documentation", sectionSequence: 15 };
  if (sectionId == 3) return { sectionName: "Bridge", sectionSequence: 2 };
  if (sectionId == 4) return { sectionName: "LSA FFA", sectionSequence: 3 };
  if (sectionId == 5)
    return { sectionName: "Accomodation", sectionSequence: 8 };
  if (sectionId == 6) return { sectionName: "Galley", sectionSequence: 11 };
  if (sectionId == 7) return { sectionName: "Hospital", sectionSequence: 10 };
  if (sectionId == 8)
    return { sectionName: "Aft Poop Deck", sectionSequence: 7 };
  if (sectionId == 9) return { sectionName: "Forecastle", sectionSequence: 6 };
  if (sectionId == 10) return { sectionName: "Upper Deck", sectionSequence: 5 };
  if (sectionId == 11) return { sectionName: "CCR", sectionSequence: 9 };
  if (sectionId == 12)
    return { sectionName: "Deck Documentation", sectionSequence: 14 };
  if (sectionId == 13)
    return { sectionName: "Emergency Head Quarters", sectionSequence: 12 };
  if (sectionId == 14)
    return { sectionName: "Master's Documentation", sectionSequence: 13 };
  if (sectionId == 15) return { sectionName: "Pumproom", sectionSequence: 4 };
  if (sectionId == 16) return { sectionName: "Security", sectionSequence: 16 };
};

module.exports = { defaultRoles, getSectionNameAndSeq };
