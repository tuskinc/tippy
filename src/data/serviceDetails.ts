
export interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price?: string;
  priceType?: 'hourly' | 'fixed' | 'variable';
  icon?: string;
}

export const serviceDetails: ServiceDetail[] = [
  // Home Services
  { id: "101", name: "Plumbing", slug: "plumbing", categoryId: "1", description: "Professional plumbing installation, repair and maintenance services" },
  { id: "102", name: "Electrical work", slug: "electrical-work", categoryId: "2", description: "Professional electrical installation and repair services" },
  { id: "103", name: "Carpentry", slug: "carpentry", categoryId: "5", description: "Custom woodworking, furniture building, and home repairs" },
  { id: "104", name: "HVAC repair and maintenance", slug: "hvac-repair", categoryId: "7", description: "Heating, ventilation, and air conditioning repairs and maintenance" },
  { id: "105", name: "Roofing", slug: "roofing", categoryId: "9", description: "Roof installation, repair, and maintenance services" },
  { id: "106", name: "Painting", slug: "painting", categoryId: "6", description: "Interior and exterior painting services" },
  { id: "107", name: "Drywall installation and repair", slug: "drywall", categoryId: "5", description: "Professional drywall services for your home or business" },
  { id: "108", name: "Flooring installation", slug: "flooring-installation", categoryId: "13", description: "Professional installation of all flooring types" },
  { id: "109", name: "Window installation and repair", slug: "window-services", categoryId: "1", description: "Window installation, replacement and repair services" },
  { id: "110", name: "Locksmith services", slug: "locksmith", categoryId: "1", description: "Professional locksmith services for homes and businesses" },
  { id: "111", name: "Garage door repair", slug: "garage-door", categoryId: "1", description: "Garage door installation and repair services" },
  { id: "112", name: "Appliance repair", slug: "appliance-repair", categoryId: "11", description: "Repair and maintenance for all major household appliances" },
  { id: "113", name: "Home security installation", slug: "home-security", categoryId: "2", description: "Professional security system installation services" },
  { id: "114", name: "Smart home setup", slug: "smart-home", categoryId: "2", description: "Smart home device installation and configuration" },
  { id: "115", name: "Pest control", slug: "pest-control", categoryId: "10", description: "Professional pest management and prevention services" },
  { id: "116", name: "Lawn care and landscaping", slug: "lawn-care", categoryId: "4", description: "Professional lawn maintenance and landscaping services" },
  { id: "117", name: "Gardening and plant care", slug: "gardening", categoryId: "4", description: "Expert gardening and plant maintenance services" },
  { id: "118", name: "Tree trimming and removal", slug: "tree-service", categoryId: "4", description: "Professional tree trimming, pruning and removal" },
  { id: "119", name: "Fence installation and repair", slug: "fence", categoryId: "5", description: "Fence installation, repair and maintenance services" },
  { id: "120", name: "Deck and patio construction", slug: "deck-patio", categoryId: "5", description: "Custom deck and patio building services" },
  { id: "121", name: "Pool maintenance", slug: "pool-maintenance", categoryId: "4", description: "Professional pool cleaning and maintenance services" },
  { id: "122", name: "Gutter cleaning", slug: "gutter-cleaning", categoryId: "3", description: "Professional gutter cleaning and maintenance" },
  { id: "123", name: "Pressure washing", slug: "pressure-washing", categoryId: "3", description: "Exterior cleaning for homes, driveways, and more" },
  { id: "124", name: "Snow removal", slug: "snow-removal", categoryId: "4", description: "Professional snow plowing and removal services" },
  
  // Cleaning Services
  { id: "201", name: "House cleaning", slug: "house-cleaning", categoryId: "3", description: "Comprehensive house cleaning services" },
  { id: "202", name: "Deep cleaning", slug: "deep-cleaning", categoryId: "3", description: "Thorough deep cleaning for homes and apartments" },
  { id: "203", name: "Move-in/move-out cleaning", slug: "move-cleaning", categoryId: "3", description: "Specialized cleaning for moving in or out" },
  { id: "204", name: "Carpet cleaning", slug: "carpet-cleaning", categoryId: "3", description: "Professional carpet and rug cleaning services" },
  { id: "205", name: "Upholstery cleaning", slug: "upholstery-cleaning", categoryId: "3", description: "Professional furniture and upholstery cleaning" },
  { id: "206", name: "Window cleaning", slug: "window-cleaning", categoryId: "3", description: "Interior and exterior window cleaning services" },
  { id: "207", name: "Air duct cleaning", slug: "air-duct-cleaning", categoryId: "7", description: "Professional air duct and HVAC cleaning" },
  { id: "208", name: "Chimney sweeping", slug: "chimney-sweeping", categoryId: "3", description: "Professional chimney cleaning and maintenance" },
  { id: "209", name: "Garbage removal", slug: "garbage-removal", categoryId: "3", description: "Residential garbage pickup and removal services" },
  { id: "210", name: "Junk hauling", slug: "junk-hauling", categoryId: "8", description: "Junk removal and hauling services" },
  { id: "211", name: "Biohazard cleaning", slug: "biohazard-cleaning", categoryId: "3", description: "Professional cleaning for biohazard situations" },

  // Personal Services
  { id: "301", name: "Hair styling", slug: "hair-styling", categoryId: "14", description: "Professional hair styling services" },
  { id: "302", name: "Barbering", slug: "barbering", categoryId: "14", description: "Professional barbering and men's grooming services" },
  { id: "303", name: "Makeup application", slug: "makeup", categoryId: "14", description: "Professional makeup services for all occasions" },
  { id: "304", name: "Massage therapy", slug: "massage", categoryId: "14", description: "Therapeutic massage services" },
  { id: "305", name: "Nail care", slug: "nail-care", categoryId: "14", description: "Professional manicure and pedicure services" },
  { id: "306", name: "Personal training", slug: "personal-training", categoryId: "21", description: "Customized fitness training programs" },
  { id: "307", name: "Yoga instruction", slug: "yoga", categoryId: "21", description: "Private and group yoga instruction" },
  { id: "308", name: "Nutritional consulting", slug: "nutrition", categoryId: "21", description: "Professional nutritional guidance and meal planning" },
  { id: "309", name: "Life coaching", slug: "life-coaching", categoryId: "16", description: "Personal development and life coaching services" },
  { id: "310", name: "Personal shopping", slug: "personal-shopping", categoryId: "14", description: "Personalized shopping assistance services" },
  { id: "311", name: "Pet grooming", slug: "pet-grooming", categoryId: "15", description: "Professional pet grooming and bathing services" },
  { id: "312", name: "Pet sitting", slug: "pet-sitting", categoryId: "15", description: "In-home pet care while you're away" },
  { id: "313", name: "Dog walking", slug: "dog-walking", categoryId: "15", description: "Professional dog walking services" },
  { id: "314", name: "Pet training", slug: "pet-training", categoryId: "15", description: "Behavior training for dogs and other pets" },

  // Professional Services
  { id: "401", name: "Accounting and bookkeeping", slug: "accounting", categoryId: "16", description: "Professional accounting and bookkeeping services" },
  { id: "402", name: "Tax preparation", slug: "tax-prep", categoryId: "16", description: "Professional tax preparation and filing services" },
  { id: "403", name: "Financial planning", slug: "financial-planning", categoryId: "16", description: "Personal and business financial planning services" },
  { id: "404", name: "Legal consulting", slug: "legal-consulting", categoryId: "16", description: "Professional legal consultation services" },
  { id: "405", name: "Notary services", slug: "notary", categoryId: "16", description: "Official notary public services" },
  { id: "406", name: "Translation services", slug: "translation", categoryId: "16", description: "Professional document and speech translation" },
  { id: "407", name: "Transcription", slug: "transcription", categoryId: "16", description: "Audio and video transcription services" },
  { id: "408", name: "Resume writing", slug: "resume-writing", categoryId: "16", description: "Professional resume and CV writing services" },
  { id: "409", name: "Career coaching", slug: "career-coaching", categoryId: "16", description: "Professional career guidance and coaching" },
  { id: "410", name: "Virtual assistance", slug: "virtual-assistant", categoryId: "16", description: "Remote administrative support services" },
  { id: "411", name: "Data entry", slug: "data-entry", categoryId: "16", description: "Accurate data entry services for businesses" },
  { id: "412", name: "IT support", slug: "it-support", categoryId: "16", description: "Technical support and IT consulting services" },
  { id: "413", name: "Computer repair", slug: "computer-repair", categoryId: "11", description: "Computer repair and maintenance services" },
  { id: "414", name: "Smartphone/tablet repair", slug: "mobile-repair", categoryId: "11", description: "Repair services for smartphones and tablets" },
  { id: "415", name: "Web design", slug: "web-design", categoryId: "16", description: "Custom website design and development" },
  { id: "416", name: "Graphic design", slug: "graphic-design", categoryId: "16", description: "Professional graphic design services" },
  { id: "417", name: "Photography", slug: "photography", categoryId: "16", description: "Professional photography services for all occasions" },
  { id: "418", name: "Videography", slug: "videography", categoryId: "16", description: "Professional video production services" },
  { id: "419", name: "Video editing", slug: "video-editing", categoryId: "16", description: "Professional video editing and post-production" },
  { id: "420", name: "Audio production", slug: "audio-production", categoryId: "16", description: "Professional audio recording and editing services" },
  { id: "421", name: "Voice over work", slug: "voice-over", categoryId: "16", description: "Professional voice acting and narration services" },
  { id: "422", name: "Content writing", slug: "content-writing", categoryId: "16", description: "SEO-optimized content creation services" },
  { id: "423", name: "Editing and proofreading", slug: "editing", categoryId: "16", description: "Professional document editing and proofreading" },
  { id: "424", name: "Social media management", slug: "social-media", categoryId: "16", description: "Professional social media account management" },
  { id: "425", name: "Marketing consulting", slug: "marketing", categoryId: "16", description: "Strategic marketing consultation services" },
  { id: "426", name: "SEO services", slug: "seo", categoryId: "16", description: "Search engine optimization for websites" },

  // Educational Services
  { id: "501", name: "Tutoring (all subjects)", slug: "tutoring", categoryId: "17", description: "One-on-one tutoring for students of all ages" },
  { id: "502", name: "Music lessons", slug: "music-lessons", categoryId: "17", description: "Instruction for various musical instruments" },
  { id: "503", name: "Art lessons", slug: "art-lessons", categoryId: "17", description: "Instruction in drawing, painting, and other art forms" },
  { id: "504", name: "Language instruction", slug: "language-lessons", categoryId: "17", description: "Foreign language teaching for all levels" },
  { id: "505", name: "Cooking classes", slug: "cooking-classes", categoryId: "17", description: "Culinary instruction for various cuisines" },
  { id: "506", name: "Dance instruction", slug: "dance-lessons", categoryId: "17", description: "Lessons for various dance styles and levels" },
  { id: "507", name: "Test preparation", slug: "test-prep", categoryId: "17", description: "Specialized preparation for standardized tests" },
  { id: "508", name: "Computer skills training", slug: "computer-training", categoryId: "17", description: "Training in software applications and computer skills" },

  // Automotive Services
  { id: "601", name: "Car repair", slug: "car-repair", categoryId: "18", description: "General automotive repair services" },
  { id: "602", name: "Oil changes", slug: "oil-change", categoryId: "18", description: "Professional oil change services" },
  { id: "603", name: "Tire replacement", slug: "tire-replacement", categoryId: "18", description: "Tire sales, installation, and repair" },
  { id: "604", name: "Car detailing", slug: "car-detailing", categoryId: "18", description: "Comprehensive auto detailing services" },
  { id: "605", name: "Mobile car wash", slug: "mobile-car-wash", categoryId: "18", description: "Convenient car washing at your location" },
  { id: "606", name: "Windshield repair", slug: "windshield-repair", categoryId: "18", description: "Windshield repair and replacement services" },
  { id: "607", name: "Battery replacement", slug: "battery-replacement", categoryId: "18", description: "Car battery testing and replacement services" },
  { id: "608", name: "Motorcycle maintenance", slug: "motorcycle-maintenance", categoryId: "18", description: "Repair and maintenance for motorcycles" },
  { id: "609", name: "Bicycle repair", slug: "bicycle-repair", categoryId: "18", description: "Bicycle repair and maintenance services" },

  // Transportation & Delivery
  { id: "701", name: "Local moving services", slug: "local-moving", categoryId: "8", description: "Professional local moving assistance" },
  { id: "702", name: "Furniture assembly", slug: "furniture-assembly", categoryId: "5", description: "Assembly services for furniture and equipment" },
  { id: "703", name: "Furniture moving", slug: "furniture-moving", categoryId: "8", description: "Help moving heavy furniture within your home" },
  { id: "704", name: "Package delivery", slug: "package-delivery", categoryId: "19", description: "Local package pickup and delivery services" },
  { id: "705", name: "Grocery delivery", slug: "grocery-delivery", categoryId: "19", description: "Grocery shopping and delivery to your door" },
  { id: "706", name: "Food delivery", slug: "food-delivery", categoryId: "19", description: "Restaurant food pickup and delivery services" },
  { id: "707", name: "Courier services", slug: "courier", categoryId: "19", description: "Express courier and document delivery" },
  { id: "708", name: "Airport transportation", slug: "airport-transportation", categoryId: "19", description: "Reliable transportation to and from airports" },

  // Event Services
  { id: "801", name: "Event planning", slug: "event-planning", categoryId: "20", description: "Comprehensive event planning and coordination" },
  { id: "802", name: "Catering", slug: "catering", categoryId: "20", description: "Professional food catering for events" },
  { id: "803", name: "Bartending", slug: "bartending", categoryId: "20", description: "Professional bartending services for events" },
  { id: "804", name: "DJ services", slug: "dj-services", categoryId: "20", description: "Professional DJ entertainment for events" },
  { id: "805", name: "Live music", slug: "live-music", categoryId: "20", description: "Live musical entertainment for events" },
  { id: "806", name: "Event photography", slug: "event-photography", categoryId: "20", description: "Professional photography for special events" },
  { id: "807", name: "Event videography", slug: "event-videography", categoryId: "20", description: "Professional video recording of events" },
  { id: "808", name: "Equipment rental", slug: "equipment-rental", categoryId: "20", description: "Audio/visual and other equipment rental" },
  { id: "809", name: "Decoration setup", slug: "decoration-setup", categoryId: "20", description: "Event decoration installation services" },
  { id: "810", name: "Floral arrangements", slug: "floral-arrangements", categoryId: "20", description: "Custom floral design for events" },
  { id: "811", name: "Cake baking and decorating", slug: "cake-baking", categoryId: "20", description: "Custom cake creation for special events" },

  // Health & Wellness
  { id: "901", name: "Home healthcare", slug: "home-healthcare", categoryId: "21", description: "Professional healthcare services at home" },
  { id: "902", name: "Elder care", slug: "elder-care", categoryId: "21", description: "Compassionate care services for seniors" },
  { id: "903", name: "Childcare", slug: "childcare", categoryId: "21", description: "Professional childcare and babysitting services" },
  { id: "904", name: "Physical therapy", slug: "physical-therapy", categoryId: "21", description: "Rehabilitative physical therapy services" },
  { id: "905", name: "Occupational therapy", slug: "occupational-therapy", categoryId: "21", description: "Specialized occupational therapy services" },
  { id: "906", name: "Speech therapy", slug: "speech-therapy", categoryId: "21", description: "Speech and language therapy services" },
  { id: "907", name: "Mental health counseling", slug: "mental-health", categoryId: "21", description: "Professional mental health support services" },
  { id: "908", name: "Nutrition consulting", slug: "nutrition-consulting", categoryId: "21", description: "Expert dietary and nutritional guidance" },
  { id: "909", name: "Fitness training", slug: "fitness-training", categoryId: "21", description: "Personalized fitness instruction and planning" },
  { id: "910", name: "Meditation instruction", slug: "meditation", categoryId: "21", description: "Guided meditation and mindfulness training" },

  // Specialty Trades
  { id: "1001", name: "Welding", slug: "welding", categoryId: "22", description: "Professional welding and metal fabrication" },
  { id: "1002", name: "Metalworking", slug: "metalworking", categoryId: "22", description: "Custom metalworking and fabrication services" },
  { id: "1003", name: "Glass repair", slug: "glass-repair", categoryId: "22", description: "Glass repair and replacement services" },
  { id: "1004", name: "Upholstery repair", slug: "upholstery-repair", categoryId: "22", description: "Furniture reupholstering and repair" },
  { id: "1005", name: "Watch and jewelry repair", slug: "jewelry-repair", categoryId: "22", description: "Professional watch and jewelry repair services" },
  { id: "1006", name: "Shoe repair", slug: "shoe-repair", categoryId: "22", description: "Professional shoe and boot repair services" },
  { id: "1007", name: "Tailoring and alterations", slug: "tailoring", categoryId: "22", description: "Clothing alterations and custom tailoring" },
  { id: "1008", name: "Sewing and mending", slug: "sewing", categoryId: "22", description: "Professional clothing repair and sewing services" },
  { id: "1009", name: "Custom furniture making", slug: "custom-furniture", categoryId: "22", description: "Handcrafted custom furniture creation" },
  { id: "1010", name: "Antique restoration", slug: "antique-restoration", categoryId: "22", description: "Specialized restoration of antique items" },
];
