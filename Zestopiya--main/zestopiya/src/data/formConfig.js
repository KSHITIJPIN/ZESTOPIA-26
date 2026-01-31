export const eventFormConfig = {
    "Dance Competition": [
        { name: "danceType", label: "Dance Type", type: "select", options: ["Solo", "Duo", "Group"], required: true },
        { name: "danceStyle", label: "Dance Style", type: "select", options: ["Classical", "Western", "Folk", "HipHop", "Fusion"], required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true, condition: (formData) => formData.danceType === 'Group' },
        { name: "performanceDuration", label: "Performance Duration (mins)", type: "text", required: true },
        { name: "trackName", label: "Song / Track Name", type: "text", required: true },
        { name: "propsRequired", label: "Props Required?", type: "select", options: ["No", "Yes"], required: true },
        { name: "propDetails", label: "Mention Props", type: "text", required: true, condition: (formData) => formData.propsRequired === 'Yes' },
        { name: "stageRequirement", label: "Background / Stage Req", type: "text", required: false },
        { name: "rulesNotice", label: "Rules: Appropriate dressing is mandatory. Item songs are not allowed.", type: "notice" }
    ],
    "Drama": [
        { name: "dramaGenre", label: "Drama Genre / Theme", type: "text", required: true },
        { name: "groupName", label: "Name of Group", type: "text", required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true },
        { name: "performanceDuration", label: "Duration (mins)", type: "text", required: true },
        { name: "language", label: "Language", type: "text", required: true },
        { name: "propsRequired", label: "Props / Setup Req", type: "text", required: true },
        { name: "micRequirement", label: "Mic Required?", type: "select", options: ["No", "Yes"], required: true },
        { name: "rulesNotice", label: "Rules: Foul language is strictly prohibited.", type: "notice" }
    ],
    "Singing": [
        { name: "performerType", label: "Performer Type", type: "select", options: ["Solo", "Duo", "Group"], required: true },
        { name: "songType", label: "Type of Song", type: "select", options: ["Classical", "Bollywood", "Western", "Folk", "Rap"], required: true },
        { name: "performanceDuration", label: "Duration (mins)", type: "text", required: true },
        { name: "participantCount", label: "No. of Performers", type: "number", required: true, condition: (formData) => formData.performerType !== 'Solo' },
        { name: "musicPreference", label: "Music Preference", type: "select", options: ["Karaoke", "Orchestra", "Instrument"], required: true },
        { name: "instrumentDetails", label: "Instrument Details", type: "text", required: false, condition: (formData) => formData.musicPreference === 'Instrument' }
    ],
    "Fashion Show": [
        { name: "participantType", label: "Participant Type", type: "select", options: ["Solo", "Group"], required: true },
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
        { name: "themeSelection", label: "Theme", type: "select", options: ["Best Out of Waste", "State Theme", "Open Theme"], required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true, condition: (formData) => formData.participantType === 'Group' },
        { name: "costumeDesc", label: "Costume Description", type: "text", required: true },
        { name: "propsAccessories", label: "Props / Accessories Used", type: "text", required: false }
    ],
    "Food Carnival": [
        { name: "stallName", label: "Stall Name", type: "text", required: true },
        { name: "participantType", label: "Type", type: "select", options: ["Solo", "Group"], required: true },
        { name: "foodType", label: "Type of Food", type: "select", options: ["Veg", "NonVeg"], required: true },
        { name: "cuisineType", label: "Cuisine Type", type: "text", required: true },
        { name: "participantCount", label: "No. of Team Members", type: "number", required: true },
        { name: "powerReq", label: "Power Requirement?", type: "select", options: ["No", "Yes"], required: true },
        { name: "specialEquip", label: "Special Equipment Needed", type: "text", required: false },
        { name: "hygieneDecl", label: "I agree to hygiene standards", type: "checkbox", required: true }
    ],
    "Ad Mad Show": [
        { name: "teamName", label: "Team Name", type: "text", required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true },
        { name: "productTopic", label: "Product / Topic", type: "text", required: true },
        { name: "language", label: "Language", type: "text", required: true },
        { name: "performanceDuration", label: "Duration", type: "text", required: true }
    ],
    "Reel Making": [
        { name: "participantType", label: "Entry Type", type: "select", options: ["Solo", "Team"], required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true, condition: (formData) => formData.participantType === 'Team' },
        { name: "reelTheme", label: "Reel Theme", type: "text", required: true },
        { name: "reelDuration", label: "Reel Duration", type: "text", required: true },
        { name: "platform", label: "Platform", type: "select", options: ["Instagram", "YouTube"], required: true },
        { name: "reelLink", label: "Reel Link (if ready)", type: "text", required: false }
    ],
    "Art Gallery": [
        { name: "artType", label: "Art Type", type: "select", options: ["Painting", "Sketch", "Digital", "Craft"], required: true },
        { name: "themeArtwork", label: "Theme of Artwork", type: "text", required: true },
        { name: "noOfEntries", label: "No. of Entries", type: "number", required: true },
        { name: "sizeArtwork", label: "Size of Artwork", type: "text", required: true },
        { name: "materialsUsed", label: "Materials Used", type: "text", required: true }
    ],
    "Mr & Mrs Freshers": [
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
        { name: "outfitTheme", label: "Outfit Theme", type: "text", required: true },
        { name: "rulesNotice", label: "Rules: All rounds are compulsory.", type: "notice" }
    ],
    "Fun Games": [
        { name: "gameCategory", label: "Game Category", type: "text", required: true },
        { name: "participantType", label: "Type", type: "select", options: ["Solo", "Team"], required: true },
        { name: "participantCount", label: "No. of Players", type: "number", required: true },
        { name: "preferredTime", label: "Preferred Time Slot", type: "text", required: false }
    ],
    "Talent Show": [
        { name: "talentType", label: "Talent Type", type: "select", options: ["Dance", "Singing", "Mimicry", "Standup", "Instrument", "Poetry", "Other"], required: true },
        { name: "performanceDuration", label: "Duration", type: "text", required: true },
        { name: "propsReq", label: "Props / Instrument Req", type: "text", required: false },
        { name: "rulesNotice", label: "Rules: Foul language is strictly prohibited.", type: "notice" }
    ],
    "Bollywood Day": [
        { name: "characterName", label: "Bollywood Character Name", type: "text", required: true },
        { name: "movieReference", label: "Movie Reference", type: "text", required: true },
        { name: "outfitDesc", label: "Costume Description", type: "text", required: true },
        { name: "participantType", label: "Type", type: "select", options: ["Solo", "Group"], required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true, condition: (formData) => formData.participantType === 'Group' }
    ],
    "Mismatch Day": [
        { name: "mismatchElements", label: "Mismatch Elements Used", type: "text", required: true },
        { name: "outfitDesc", label: "Describe Your Mismatch Outfit", type: "text", required: true },
        { name: "participantType", label: "Type", type: "select", options: ["Solo", "Group"], required: true },
        { name: "participantCount", label: "No. of Participants", type: "number", required: true, condition: (formData) => formData.participantType === 'Group' }
    ]
};
