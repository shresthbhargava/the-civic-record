export const translations = {
  en: {
    tagline: "Accountability • Transparency • Justice",
    searchPlaceholderNat: "Search any civic issue, department, or official...",
    searchPlaceholderState: "What do you seek accountability for in {state}?",
    latestDispatches: "Latest Dispatches",
    businessEconomy: "Business & Economy",
    publicTenders: "Public Tenders & Projects Record",
    deepDive: "Deep Dive Investigation",
    searchBtn: "SEARCH"
  },
  hi: {
    tagline: "जवाबदेही • पारदर्शिता • न्याय",
    searchPlaceholderNat: "किसी भी नागरिक मुद्दे, विभाग या अधिकारी को खोजें...",
    searchPlaceholderState: "{state} में आप किसकी जवाबदेही चाहते हैं?",
    latestDispatches: "नवीनतम समाचार",
    businessEconomy: "व्यापार और अर्थव्यवस्था",
    publicTenders: "सार्वजनिक निविदाएं और परियोजना रिकॉर्ड",
    deepDive: "गहन जांच",
    searchBtn: "खोजें"
  },
  mr: {
    tagline: "उत्तरदायित्व • पारदर्शकता • न्याय",
    searchPlaceholderNat: "कोणताही नागरी मुद्दा, विभाग किंवा अधिकारी शोधा...",
    searchPlaceholderState: "{state} मध्ये तुम्हाला कोणाची जबाबदारी हवी आहे?",
    latestDispatches: "ताज्या बातम्या",
    businessEconomy: "व्यापार आणि अर्थव्यवस्था",
    publicTenders: "सार्वजनिक निविदा आणि प्रकल्प रेकॉर्ड",
    deepDive: "सखोल चौकशी",
    searchBtn: "शोधा"
  },
  bn: {
    tagline: "জবাবদিহিতা • স্বচ্ছতা • ন্যায়বিচার",
    searchPlaceholderNat: "যেকোনো নাগরিক সমস্যা, বিভাগ বা কর্মকর্তা অনুসন্ধান করুন...",
    searchPlaceholderState: "{state} এ আপনি কার জবাবদিহি চান?",
    latestDispatches: "সর্বশেষ খবর",
    businessEconomy: "ব্যবসা ও অর্থনীতি",
    publicTenders: "পাবলিক টেন্ডার এবং প্রকল্প রেকর্ড",
    deepDive: "গভীর তদন্ত",
    searchBtn: "অনুসন্ধান"
  },
  ta: {
    tagline: "பொறுப்புக்கூறல் • வெளிப்படைத்தன்மை • நீதி",
    searchPlaceholderNat: "எந்தவொரு குடிமக்கள் பிரச்சனை, துறை அல்லது அதிகாரியைத் தேடுங்கள்...",
    searchPlaceholderState: "{state} இல் நீங்கள் எதற்கு பொறுப்புக்கூற விரும்புகிறீர்கள்?",
    latestDispatches: "சமீபத்திய செய்திகள்",
    businessEconomy: "வணிகம் மற்றும் பொருளாதாரம்",
    publicTenders: "பொது ஒப்பந்தங்கள் மற்றும் திட்ட பதிவுகள்",
    deepDive: "ஆழமான விசாரணை",
    searchBtn: "தேடு"
  }
};

export const getTranslation = (lang, key, params = {}) => {
  let text = translations[lang]?.[key] || translations['en'][key];
  Object.keys(params).forEach(p => {
    text = text.replace(`{${p}}`, params[p]);
  });
  return text;
};

// Map specific states to their primary language codes
export const stateToLanguageMap = {
  'mh': 'mr', // Maharashtra -> Marathi
  'tn': 'ta', // Tamil Nadu -> Tamil
  'wb': 'bn', // West Bengal -> Bengali
  'up': 'hi', // Uttar Pradesh -> Hindi
  'dl': 'hi', // Delhi -> Hindi
  'rj': 'hi', // Rajasthan -> Hindi
  'br': 'hi', // Bihar -> Hindi
  'gj': 'hi', // Gujarat (fallback Hindi/English if Guj not req)
  'ka': 'en', // Karnataka (fallback Eng if Kannada not req)
};
