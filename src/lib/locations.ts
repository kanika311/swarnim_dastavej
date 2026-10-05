export interface StateLocation {
  name: string;
  nameHi: string;
  cities: { name: string; nameHi: string }[];
}

export const ALL_INDIA_LOCATIONS: StateLocation[] = [
  {
    name: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    cities: [
      { name: 'Lucknow', nameHi: 'लखनऊ' },
      { name: 'Sultanpur', nameHi: 'सुल्तानपुर' },
      { name: 'Kanpur', nameHi: 'कानपुर' },
      { name: 'Ayodhya', nameHi: 'अयोध्या' },
      { name: 'Varanasi', nameHi: 'वाराणसी' },
      { name: 'Prayagraj', nameHi: 'प्रयागराज' },
      { name: 'Gorakhpur', nameHi: 'गोरखपुर' },
      { name: 'Noida / Greater Noida', nameHi: 'नोएडा / ग्रेटर नोएडा' },
      { name: 'Ghaziabad', nameHi: 'गाजियाबाद' },
      { name: 'Agra', nameHi: 'आगरा' },
      { name: 'Meerut', nameHi: 'मेरठ' },
      { name: 'Bareilly', nameHi: 'बरेली' },
      { name: 'Aligarh', nameHi: 'अलीगढ़' },
      { name: 'Moradabad', nameHi: 'मुरादाबाद' },
      { name: 'Saharanpur', nameHi: 'सहारनपुर' },
      { name: 'Jhansi', nameHi: 'झांसी' },
      { name: 'Lakhimpur Kheri', nameHi: 'लखीमपुर खीरी' },
      { name: 'Hardoi', nameHi: 'हरदोई' },
      { name: 'Barabanki', nameHi: 'बाराबंकी' },
      { name: 'Unnao', nameHi: 'उन्नाव' },
      { name: 'Rae Bareli', nameHi: 'रायबरेली' },
      { name: 'Sultanpur', nameHi: 'सुल्तानपुर' },
      { name: 'Mirzapur', nameHi: 'मिर्जापुर' },
      { name: 'Mathura', nameHi: 'मथुरा' },
      { name: 'Firozabad', nameHi: 'फिरोजाबाद' },
      { name: 'Muzaffarnagar', nameHi: 'मुजफ्फरनगर' },
      { name: 'Budaun', nameHi: 'बदायूं' },
      { name: 'Shahjahanpur', nameHi: 'शाहजहांपुर' },
      { name: 'Bahraich', nameHi: 'बहराइच' },
      { name: 'Gonda', nameHi: 'गोंडा' },
      { name: 'Basti', nameHi: 'बस्ती' },
      { name: 'Azamgarh', nameHi: 'आजमगढ़' },
      { name: 'Ballia', nameHi: 'बलिया' },
      { name: 'Jaunpur', nameHi: 'जौनपुर' },
      { name: 'Farrukhabad', nameHi: 'फर्रुखाबाद' },
      { name: 'Fatehpur', nameHi: 'फतेहपुर' },
      { name: 'Etawah', nameHi: 'इटावा' },
      { name: 'Mainpuri', nameHi: 'मैनपुरी' }
    ]
  },
  {
    name: 'Delhi (NCR)',
    nameHi: 'दिल्ली (एनसीआर)',
    cities: [
      { name: 'New Delhi', nameHi: 'नई दिल्ली' },
      { name: 'Central Delhi', nameHi: 'मध्य दिल्ली' },
      { name: 'North Delhi', nameHi: 'उत्तरी दिल्ली' },
      { name: 'South Delhi', nameHi: 'दक्षिणी दिल्ली' },
      { name: 'East Delhi', nameHi: 'पूर्वी दिल्ली' },
      { name: 'West Delhi', nameHi: 'पश्चिमी दिल्ली' },
      { name: 'Gurugram', nameHi: 'गुरुग्राम' },
      { name: 'Faridabad', nameHi: 'फरीदाबाद' },
      { name: 'Noida', nameHi: 'नोएडा' },
      { name: 'Ghaziabad', nameHi: 'गाजियाबाद' }
    ]
  },
  {
    name: 'Bihar',
    nameHi: 'बिहार',
    cities: [
      { name: 'Patna', nameHi: 'पटना' },
      { name: 'Gaya', nameHi: 'गया' },
      { name: 'Bhagalpur', nameHi: 'भागलपुर' },
      { name: 'Muzaffarpur', nameHi: 'मुजफ्फरपुर' },
      { name: 'Purnia', nameHi: 'पूर्णिया' },
      { name: 'Darbhanga', nameHi: 'दरभंगा' },
      { name: 'Bihar Sharif', nameHi: 'बिहार शरीफ' },
      { name: 'Arrah', nameHi: 'आरा' },
      { name: 'Begusarai', nameHi: 'बेगूसराय' },
      { name: 'Katihar', nameHi: 'कटिहार' },
      { name: 'Munger', nameHi: 'मुंगेर' },
      { name: 'Chhapra', nameHi: 'छपरा' }
    ]
  },
  {
    name: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    cities: [
      { name: 'Bhopal', nameHi: 'भोपाल' },
      { name: 'Indore', nameHi: 'इंदौर' },
      { name: 'Gwalior', nameHi: 'ग्वालियर' },
      { name: 'Jabalpur', nameHi: 'जबलपुर' },
      { name: 'Ujjain', nameHi: 'उज्जैन' },
      { name: 'Sagar', nameHi: 'सागर' },
      { name: 'Dewas', nameHi: 'देवास' },
      { name: 'Satna', nameHi: 'सतना' },
      { name: 'Ratlam', nameHi: 'रतलाम' },
      { name: 'Rewa', nameHi: 'रीवा' }
    ]
  },
  {
    name: 'Rajasthan',
    nameHi: 'राजस्थान',
    cities: [
      { name: 'Jaipur', nameHi: 'जयपुर' },
      { name: 'Jodhpur', nameHi: 'जोधपुर' },
      { name: 'Kota', nameHi: 'कोटा' },
      { name: 'Bikaner', nameHi: 'बीकानेर' },
      { name: 'Ajmer', nameHi: 'अजमेर' },
      { name: 'Udaipur', nameHi: 'उदयपुर' },
      { name: 'Bhilwara', nameHi: 'भीलवाड़ा' },
      { name: 'Alwar', nameHi: 'अलवर' },
      { name: 'Sikar', nameHi: 'सीकर' },
      { name: 'Bharatpur', nameHi: 'भरतपुर' }
    ]
  },
  {
    name: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    cities: [
      { name: 'Mumbai', nameHi: 'मुंबई' },
      { name: 'Pune', nameHi: 'पुणे' },
      { name: 'Nagpur', nameHi: 'नागपुर' },
      { name: 'Nashik', nameHi: 'नासिक' },
      { name: 'Chhatrapati Sambhajinagar (Aurangabad)', nameHi: 'छत्रपति संभाजीनगर (औरंगाबाद)' },
      { name: 'Thane', nameHi: 'ठाणे' },
      { name: 'Solapur', nameHi: 'सोलापुर' },
      { name: 'Kolhapur', nameHi: 'कोल्हापुर' },
      { name: 'Navi Mumbai', nameHi: 'नवी मुंबई' },
      { name: 'Amravati', nameHi: 'अमरावती' }
    ]
  },
  {
    name: 'Gujarat',
    nameHi: 'गुजरात',
    cities: [
      { name: 'Ahmedabad', nameHi: 'अहमदाबाद' },
      { name: 'Surat', nameHi: 'सूरत' },
      { name: 'Vadodara', nameHi: 'वडोदरा' },
      { name: 'Rajkot', nameHi: 'राजकोट' },
      { name: 'Bhavnagar', nameHi: 'भावनगर' },
      { name: 'Jamnagar', nameHi: 'जामनगर' },
      { name: 'Gandhinagar', nameHi: 'गांधीनगर' },
      { name: 'Junagadh', nameHi: 'जूनागढ़' },
      { name: 'Anand', nameHi: 'आणंद' }
    ]
  },
  {
    name: 'Haryana',
    nameHi: 'हरियाणा',
    cities: [
      { name: 'Gurugram', nameHi: 'गुरुग्राम' },
      { name: 'Faridabad', nameHi: 'फरीदाबाद' },
      { name: 'Panipat', nameHi: 'पानीपत' },
      { name: 'Ambala', nameHi: 'अंबाला' },
      { name: 'Karnal', nameHi: 'करनाल' },
      { name: 'Rohtak', nameHi: 'रोहतक' },
      { name: 'Hisar', nameHi: 'हिसार' },
      { name: 'Sonipat', nameHi: 'सोनीपत' },
      { name: 'Panchkula', nameHi: 'पंचकुला' }
    ]
  },
  {
    name: 'Punjab',
    nameHi: 'पंजाब',
    cities: [
      { name: 'Chandigarh', nameHi: 'चंडीगढ़' },
      { name: 'Ludhiana', nameHi: 'लुधियाना' },
      { name: 'Amritsar', nameHi: 'अमृतसर' },
      { name: 'Jalandhar', nameHi: 'जालंधर' },
      { name: 'Patiala', nameHi: 'पटियाला' },
      { name: 'Bathinda', nameHi: 'बठिंडा' },
      { name: 'Mohali', nameHi: 'मोहाली' }
    ]
  },
  {
    name: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    cities: [
      { name: 'Dehradun', nameHi: 'देहरादून' },
      { name: 'Haridwar', nameHi: 'हरिद्वार' },
      { name: 'Roorkee', nameHi: 'रुड़की' },
      { name: 'Haldwani', nameHi: 'हल्द्वानी' },
      { name: 'Nainital', nameHi: 'नैनीताल' },
      { name: 'Rishikesh', nameHi: 'ऋषिकेश' },
      { name: 'Rudrapur', nameHi: 'रुद्रपुर' }
    ]
  },
  {
    name: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    cities: [
      { name: 'Shimla', nameHi: 'शिमला' },
      { name: 'Dharamshala', nameHi: 'धर्मशाला' },
      { name: 'Solan', nameHi: 'सोलन' },
      { name: 'Mandi', nameHi: 'मंडी' },
      { name: 'Kullu / Manali', nameHi: 'कुल्लू / मनाली' }
    ]
  },
  {
    name: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    cities: [
      { name: 'Kolkata', nameHi: 'कोलकाता' },
      { name: 'Howrah', nameHi: 'हावड़ा' },
      { name: 'Durgapur', nameHi: 'दुर्गापुर' },
      { name: 'Asansol', nameHi: 'आसनसोल' },
      { name: 'Siliguri', nameHi: 'सिलीगुड़ी' }
    ]
  },
  {
    name: 'Jharkhand',
    nameHi: 'झारखंड',
    cities: [
      { name: 'Ranchi', nameHi: 'रांची' },
      { name: 'Jamshedpur', nameHi: 'जमशेदपुर' },
      { name: 'Dhanbad', nameHi: 'धनबाद' },
      { name: 'Bokaro', nameHi: 'बोकारो' },
      { name: 'Deoghar', nameHi: 'देवघर' }
    ]
  },
  {
    name: 'Chhattisgarh',
    nameHi: 'छत्तीसगढ़',
    cities: [
      { name: 'Raipur', nameHi: 'रायपुर' },
      { name: 'Bhilai', nameHi: 'भिलाई' },
      { name: 'Bilaspur', nameHi: 'बिलासपुर' },
      { name: 'Korba', nameHi: 'कोरबा' }
    ]
  },
  {
    name: 'Odisha',
    nameHi: 'ओडिशा',
    cities: [
      { name: 'Bhubaneswar', nameHi: 'भुवनेश्वर' },
      { name: 'Cuttack', nameHi: 'कटक' },
      { name: 'Rourkela', nameHi: 'राउरकेला' },
      { name: 'Puri', nameHi: 'पुरी' }
    ]
  },
  {
    name: 'Jammu & Kashmir',
    nameHi: 'जम्मू और कश्मीर',
    cities: [
      { name: 'Srinagar', nameHi: 'श्रीनगर' },
      { name: 'Jammu', nameHi: 'जम्मू' },
      { name: 'Anantnag', nameHi: 'अनंतनाग' }
    ]
  },
  {
    name: 'Karnataka',
    nameHi: 'कर्नाटक',
    cities: [
      { name: 'Bengaluru', nameHi: 'बेंगलुरु' },
      { name: 'Mysuru', nameHi: 'मैसूरु' },
      { name: 'Mangaluru', nameHi: 'मंगलुरु' },
      { name: 'Hubballi', nameHi: 'हुबली' }
    ]
  },
  {
    name: 'Telangana',
    nameHi: 'तेलंगाना',
    cities: [
      { name: 'Hyderabad', nameHi: 'हैदराबाद' },
      { name: 'Warangal', nameHi: 'वारंगल' },
      { name: 'Nizamabad', nameHi: 'निज़ामाबाद' }
    ]
  },
  {
    name: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    cities: [
      { name: 'Visakhapatnam', nameHi: 'विशाखापट्टनम' },
      { name: 'Vijayawada', nameHi: 'विजयवाड़ा' },
      { name: 'Tirupati', nameHi: 'तिरुपति' }
    ]
  },
  {
    name: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    cities: [
      { name: 'Chennai', nameHi: 'चेन्नई' },
      { name: 'Coimbatore', nameHi: 'कोयंबटूर' },
      { name: 'Madurai', nameHi: 'मदुरै' }
    ]
  },
  {
    name: 'Kerala',
    nameHi: 'केरल',
    cities: [
      { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम' },
      { name: 'Kochi', nameHi: 'कोच्चि' },
      { name: 'Kozhikode', nameHi: 'कोझिकोड' }
    ]
  },
  {
    name: 'Assam',
    nameHi: 'असम',
    cities: [
      { name: 'Guwahati', nameHi: 'गुवाहाटी' },
      { name: 'Silchar', nameHi: 'सिलचर' },
      { name: 'Dibrugarh', nameHi: 'डिब्रूगढ़' },
      { name: 'Jorhat', nameHi: 'जोरहाट' },
      { name: 'Tezpur', nameHi: 'तेज़पुर' }
    ]
  },
  {
    name: 'Goa',
    nameHi: 'गोवा',
    cities: [
      { name: 'Panaji', nameHi: 'पणजी' },
      { name: 'Margao', nameHi: 'मडगांव' },
      { name: 'Vasco da Gama', nameHi: 'वास्को द गामा' }
    ]
  },
  {
    name: 'Sikkim',
    nameHi: 'सिक्किम',
    cities: [
      { name: 'Gangtok', nameHi: 'गंगटोक' },
      { name: 'Namchi', nameHi: 'नामची' },
      { name: 'Gyalshing', nameHi: 'ग्यालशिंग' }
    ]
  },
  {
    name: 'Arunachal Pradesh',
    nameHi: 'अरुणाचल प्रदेश',
    cities: [
      { name: 'Itanagar', nameHi: 'ईटानगर' },
      { name: 'Naharlagun', nameHi: 'नहरलागुन' },
      { name: 'Tawang', nameHi: 'तवांग' }
    ]
  },
  {
    name: 'Nagaland',
    nameHi: 'नागालैंड',
    cities: [
      { name: 'Kohima', nameHi: 'कोहिमा' },
      { name: 'Dimapur', nameHi: 'दीमापुर' },
      { name: 'Mokokchung', nameHi: 'मोकोकचुंग' }
    ]
  },
  {
    name: 'Manipur',
    nameHi: 'मणिपुर',
    cities: [
      { name: 'Imphal', nameHi: 'इम्फाल' },
      { name: 'Thoubal', nameHi: 'थौबल' },
      { name: 'Churachandpur', nameHi: 'चुराचांदपुर' }
    ]
  },
  {
    name: 'Mizoram',
    nameHi: 'मिज़ोरम',
    cities: [
      { name: 'Aizawl', nameHi: 'आइजोल' },
      { name: 'Lunglei', nameHi: 'लुंगलेई' },
      { name: 'Champhai', nameHi: 'चंफाई' }
    ]
  },
  {
    name: 'Tripura',
    nameHi: 'त्रिपुरा',
    cities: [
      { name: 'Agartala', nameHi: 'अगरतला' },
      { name: 'Udaipur', nameHi: 'उदयपुर' },
      { name: 'Dharmanagar', nameHi: 'धर्मनगर' }
    ]
  },
  {
    name: 'Meghalaya',
    nameHi: 'मेघालय',
    cities: [
      { name: 'Shillong', nameHi: 'शिलांग' },
      { name: 'Tura', nameHi: 'तुरा' },
      { name: 'Jowai', nameHi: 'जोवाई' }
    ]
  },
  {
    name: 'Ladakh',
    nameHi: 'लद्दाख',
    cities: [
      { name: 'Leh', nameHi: 'लेह' },
      { name: 'Kargil', nameHi: 'कारगिल' }
    ]
  },
  {
    name: 'Chandigarh',
    nameHi: 'चंडीगढ़',
    cities: [
      { name: 'Chandigarh', nameHi: 'चंडीगढ़' }
    ]
  },
  {
    name: 'Puducherry',
    nameHi: 'पुदुच्चेरी',
    cities: [
      { name: 'Puducherry', nameHi: 'पुदुच्चेरी' },
      { name: 'Karaikal', nameHi: 'कराईकल' },
      { name: 'Mahe', nameHi: 'माहे' },
      { name: 'Yanam', nameHi: 'यानम' }
    ]
  },
  {
    name: 'Andaman and Nicobar Islands',
    nameHi: 'अंडमान और निकोबार द्वीपसमूह',
    cities: [
      { name: 'Port Blair', nameHi: 'पोर्ट ब्लेयर' }
    ]
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    nameHi: 'दादरा और नगर हवेली एवं दमन और दीव',
    cities: [
      { name: 'Silvassa', nameHi: 'सिलवासा' },
      { name: 'Daman', nameHi: 'दमन' },
      { name: 'Diu', nameHi: 'दीव' }
    ]
  },
  {
    name: 'Lakshadweep',
    nameHi: 'लक्षद्वीप',
    cities: [
      { name: 'Kavaratti', nameHi: 'कवरत्ती' }
    ]
  }
];

// Flat list of all city names
export const ALL_INDIAN_CITIES: string[] = ALL_INDIA_LOCATIONS.flatMap(s => s.cities.map(c => c.name));

// Common top cities for quick pills/filters
export const TOP_FEATURED_CITIES = [
  { name: 'सभी शहर', nameEn: 'All Cities' },
  { name: 'लखनऊ', nameEn: 'Lucknow' },
  { name: 'सुल्तानपुर', nameEn: 'Sultanpur' },
  { name: 'कानपुर', nameEn: 'Kanpur' },
  { name: 'अयोध्या', nameEn: 'Ayodhya' },
  { name: 'वाराणसी', nameEn: 'Varanasi' },
  { name: 'प्रयागराज', nameEn: 'Prayagraj' },
  { name: 'दिल्ली एनसीआर', nameEn: 'Delhi NCR' },
  { name: 'पटना', nameEn: 'Patna' },
  { name: 'भोपाल', nameEn: 'Bhopal' },
  { name: 'जयपुर', nameEn: 'Jaipur' },
  { name: 'मुंबई', nameEn: 'Mumbai' },
  { name: 'कोलकाता', nameEn: 'Kolkata' },
  { name: 'चंडीगढ़', nameEn: 'Chandigarh' },
  { name: 'देहरादून', nameEn: 'Dehradun' }
];
