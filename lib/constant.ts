import { Round } from "@/types/round";

export const adminAddress = process.env.NEXT_PUBLIC_PLATFORM_ADMIN;

export const USDC_ADDRESS = process.env.NEXT_PUBLIC_PLEDGE_TOKEN;

// Mock user campaigns - In production, this would come from API
export const MOCK_USER_CAMPAIGNS = [
	{
		id: "campaign-1",
		title: "My First Campaign"
	},
	{
		id: "campaign-2",
		title: "Another Campaign"
	}
];

// Import mock data from the main rounds page
export const MOCK_ROUNDS: Round[] = [
	{
		id: "dapps-and-apps",
		title: "dApps and Apps",
		description: "This initiative funds innovative dApps & Apps in two areas: 1) User-friendly applications enhancing Web3 accessibility and usability, and 2) Projects advancing financial inclusion, education, and social impact. The goal is to accelerate growth and adoption of the ecosystem.",
		type: "OSS_ROUND",
		category: "Development",
		matchingPool: 300000,
		startDate: "2024-02-01",
		endDate: "2024-04-01",
		status: "ACTIVE",
		organization: {
			name: "Akashic",
			logo: "/akashic-logo.png"
		}
	},
	{
		id: "web3-infrastructure",
		title: "Web3 Infrastructure",
		description: "This round aims to strengthen the Ethereum ecosystem's foundational infrastructure by supporting projects crucial for its development, scalability, and security.",
		type: "OSS_ROUND",
		category: "Infrastructure",
		matchingPool: 300000,
		startDate: "2024-02-01",
		endDate: "2024-04-01",
		status: "ACTIVE",
		organization: {
			name: "Filecoin",
			logo: "/filecoin-logo.png"
		}
	},
	{
		id: "dev-tooling",
		title: "Dev Tooling",
		description: "This round funds projects enhancing developer tools for OSS and Web3. We support creation of environments, frameworks, and libraries for efficient, secure smart contract development. Goals: reduce barriers, boost efficiency, and show strong community adoption.",
		type: "OSS_ROUND",
		category: "Development",
		matchingPool: 300000,
		startDate: "2024-03-15",
		endDate: "2024-04-15",
		status: "UPCOMING",
		organization: {
			name: "Akashic",
			logo: "/akashic-logo.png"
		}
	},
	{
		id: "web3-social",
		title: "Web3 Social",
		description: "This round funds projects that enhance social experiences and interactions within the Web3 ecosystem.",
		type: "OSS_ROUND",
		category: "Social",
		matchingPool: 300000,
		startDate: "2024-01-01",
		endDate: "2024-02-01",
		status: "ENDED",
		organization: {
			name: "Akashic",
			logo: "/akashic-logo.png"
		}
	}
];


export const countries = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antarctica",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas ",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia (Plurinational State of)",
	"Bonaire, Sint Eustatius and Saba",
	"Bosnia and Herzegovina",
	"Botswana",
	"Bouvet Island",
	"Brazil",
	"British Indian Ocean Territory ",
	"Brunei Darussalam",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cayman Islands ",
	"Central African Republic ",
	"Chad",
	"Chile",
	"China",
	"Christmas Island",
	"Cocos (Keeling) Islands ",
	"Colombia",
	"Comoros ",
	"Congo ",
	"Cook Islands ",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Côte d'Ivoire",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Falkland Islands [Malvinas]",
	"Faroe Islands",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"French Southern Territories",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Heard Island and McDonald Islands",
	"Holy See",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran (Islamic Republic of)",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea",
	"Kuwait",
	"Kyrgyzstan",
	"Lao People's Democratic Republic",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia (Federated States of)",
	"Moldova (the Republic of)",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"Northern Mariana Islands",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine, State of",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Pitcairn",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Republic of North Macedonia",
	"Romania",
	"Russian Federation",
	"Rwanda",
	"Réunion",
	"Saint Barthélemy",
	"Saint Helena, Ascension and Tristan da Cunha",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Martin (French part)",
	"Saint Pierre and Miquelon",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten (Dutch part)",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Georgia and the South Sandwich Islands",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan",
	"Suriname",
	"Svalbard and Jan Mayen",
	"Sweden",
	"Switzerland",
	"Syrian Arab Republic",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks and Caicos Islands",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States Minor Outlying Islands",
	"United States of America",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela (Bolivarian Republic)",
	"Viet Nam",
	"Virgin Islands (British)",
	"Virgin Islands (U.S.)",
	"Wallis and Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe",
	"Åland Islands"
];