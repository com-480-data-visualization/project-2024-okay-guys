var simplemaps_worldmap_mapdata = {
main_settings:{
		//General settings
		width: '700', //or 'responsive'
		background_color: '#C0C0C0',	
		background_transparent: 'no',
		popups: 'on_click', //on_click, on_hover, or detect
	
		
		//Zoom settings
		manual_zoom: 'no',
		back_image: 'no',
		arrow_box: 'no',
		navigation_size: '40',
		navigation_color: '#f7f7f7',
		navigation_border_color: '#636363',
		initial_back: 'no', //Show back button when zoomed out and do this JavaScript upon click		
		initial_zoom: -1,  //-1 is zoomed out, 0 is for the first continent etc	
		initial_zoom_solo: 'no', //hide adjacent states when starting map zoomed in
		region_opacity: 1,
		region_hover_opacity: .6,
		zoom_out_incrementally: 'yes',  // if no, map will zoom all the way out on click
		zoom_percentage: .99,
		zoom_time: .5, //time to zoom between regions in seconds
		
		//Popup settings
		popup_color: 'white',
		popup_opacity: .9,
		popup_shadow: 1,
		popup_corners: 5,
		popup_font: '12px/1.5 Verdana, Arial, Helvetica, sans-serif',
		popup_nocss: 'no', //use your own css	
		
		//Advanced settings
		div: 'map',
		auto_load: 'yes',		
    	rotate: '0',
		url_new_tab: 'yes', 
		images_directory: 'default', //e.g. 'map_images/'
    	import_labels: 'no',
		fade_time:  .1, //time to fade out		
		link_text: 'View Website'  //Text mobile browsers will see for links	
		
	},

state_specific:{		
	AE: { 
	name: 'United Arab Emirates',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	inactive: 'no',
	url: 'default' //Note:  You must omit the comma after the last property in an object to prevent errors in internet explorer.
	},

	AF: { 
	name: 'Afghanistan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AL: { 
	name: 'Albania',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AM: { 
	name: 'Armenia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AO: { 
	name: 'Angola',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AR: { 
	name: 'Argentina',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AT: { 
	name: 'Austria',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AU: { 
	name: 'Australia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	AZ: { 
	name: 'Azerbaidjan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BA: { 
	name: 'Bosnia-Herzegovina',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BD: { 
	name: 'Bangladesh',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BE: { 
	name: 'Belgium',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BF: { 
	name: 'Burkina Faso',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BG: { 
	name: 'Bulgaria',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BH: { 
	name: 'Bahrain',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BI: { 
	name: 'Burundi',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BJ: { 
	name: 'Benin',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BN: { 
	name: 'Brunei Darussalam',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BO: { 
	name: 'Bolivia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BR: { 
	name: 'Brazil',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BS: { 
	name: 'Bahamas',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BT: { 
	name: 'Bhutan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BW: { 
	name: 'Botswana',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BY: { 
	name: 'Belarus',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	BZ: { 
	name: 'Belize',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CA: { 
	name: 'Canada',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CD: { 
	name: 'Congo',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CF: { 
	name: 'Central African Republic',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CG: { 
	name: 'Congo',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CH: { 
	name: 'Switzerland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CI: { 
	name: 'Ivory Coast',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CL: { 
	name: 'Chile',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CM: { 
	name: 'Cameroon',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CN: { 
	name: 'China',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CO: { 
	name: 'Colombia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CR: { 
	name: 'Costa Rica',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CU: { 
	name: 'Cuba',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CV: { 
	name: 'Cape Verde',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CY: { 
	name: 'Cyprus',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	CZ: { 
	name: 'Czech Republic',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	DE: { 
	name: 'Germany',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	DJ: { 
	name: 'Djibouti',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	DK: { 
	name: 'Denmark',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	DO: { 
	name: 'Dominican Republic',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	DZ: { 
	name: 'Algeria',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	EC: { 
	name: 'Ecuador',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	EE: { 
	name: 'Estonia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	EG: { 
	name: 'Egypt',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	EH: { 
	name: 'Western Sahara',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ER: { 
	name: 'Eritrea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ES: { 
	name: 'Spain',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ET: { 
	name: 'Ethiopia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	FI: { 
	name: 'Finland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	FJ: { 
	name: 'Fiji',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	FK: { 
	name: 'Falkland Islands',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	FR: { 
	name: 'France',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GA: { 
	name: 'Gabon',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GB: { 
	name: 'Great Britain',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GE: { 
	name: 'Georgia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GF: { 
	name: 'French Guyana',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GH: { 
	name: 'Ghana',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GL: { 
	name: 'Greenland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GM: { 
	name: 'Gambia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GN: { 
	name: 'Guinea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GQ: { 
	name: 'Equatorial Guinea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GR: { 
	name: 'Greece',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GS: { 
	name: 'S. Georgia & S. Sandwich Isls.',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GT: { 
	name: 'Guatemala',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GW: { 
	name: 'Guinea Bissau',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	GY: { 
	name: 'Guyana',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	HN: { 
	name: 'Honduras',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	HR: { 
	name: 'Croatia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	HT: { 
	name: 'Haiti',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	HU: { 
	name: 'Hungary',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IC: { 
	name: 'Canary Islands',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ID: { 
	name: 'Indonesia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IE: { 
	name: 'Ireland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IL: { 
	name: 'Israel',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IN: { 
	name: 'India',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IQ: { 
	name: 'Iraq',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IR: { 
	name: 'Iran',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IS: { 
	name: 'Iceland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	IT: { 
	name: 'Italy',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	JM: { 
	name: 'Jamaica',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	JO: { 
	name: 'Jordan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	JP: { 
	name: 'Japan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KE: { 
	name: 'Kenya',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KG: { 
	name: 'Kyrgyzstan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KH: { 
	name: 'Cambodia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KP: { 
	name: 'North Korea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KR: { 
	name: 'South Korea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KW: { 
	name: 'Kuwait',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	KZ: { 
	name: 'Kazakhstan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LA: { 
	name: 'Laos',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LK: { 
	name: 'Sri Lanka',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LR: { 
	name: 'Liberia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LS: { 
	name: 'Lesotho',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LT: { 
	name: 'Lithuania',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LU: { 
	name: 'Luxembourg',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LV: { 
	name: 'Latvia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	LY: { 
	name: 'Libya',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MA: { 
	name: 'Morocco',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MD: { 
	name: 'Moldavia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ME: { 
	name: 'Montenegro',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MG: { 
	name: 'Madagascar',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MK: { 
	name: 'Macedonia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ML: { 
	name: 'Mali',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MM: { 
	name: 'Myanmar',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MN: { 
	name: 'Mongolia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MR: { 
	name: 'Mauritania',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MW: { 
	name: 'Malawi',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MX: { 
	name: 'Mexico',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MY: { 
	name: 'Malaysia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	MZ: { 
	name: 'Mozambique',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NA: { 
	name: 'Namibia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NC: { 
	name: 'New Caledonia (French)',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NE: { 
	name: 'Niger',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NG: { 
	name: 'Nigeria',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NI: { 
	name: 'Nicaragua',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NL: { 
	name: 'Netherlands',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NO: { 
	name: 'Norway',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NP: { 
	name: 'Nepal',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	NZ: { 
	name: 'New Zealand',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	OM: { 
	name: 'Oman',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PA: { 
	name: 'Panama',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PE: { 
	name: 'Peru',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PG: { 
	name: 'Papua New Guinea',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PH: { 
	name: 'Philippines',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PK: { 
	name: 'Pakistan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PL: { 
	name: 'Poland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PR: { 
	name: 'Puerto Rico',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PS: { 
	name: 'Palestine',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PT: { 
	name: 'Portugal',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	PY: { 
	name: 'Paraguay',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	QA: { 
	name: 'Qatar',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	RO: { 
	name: 'Romania',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	RS: { 
	name: 'Serbia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	RU: { 
	name: 'Russia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	RW: { 
	name: 'Rwanda',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SA: { 
	name: 'Saudi Arabia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SB: { 
	name: 'Solomon Islands',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SD: { 
	name: 'Sudan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SE: { 
	name: 'Sweden',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SI: { 
	name: 'Slovenia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SK: { 
	name: 'Slovak Republic',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SL: { 
	name: 'Sierra Leone',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SN: { 
	name: 'Senegal',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SO: { 
	name: 'Somalia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SR: { 
	name: 'Suriname',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SS: { 
	name: 'South Sudan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SV: { 
	name: 'El Salvador',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SY: { 
	name: 'Syria',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	SZ: { 
	name: 'Swaziland',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TD: { 
	name: 'Chad',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TG: { 
	name: 'Togo',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TH: { 
	name: 'Thailand',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TJ: { 
	name: 'Tadjikistan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TL: { 
	name: 'East Timor',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TM: { 
	name: 'Turkmenistan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TN: { 
	name: 'Tunisia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TR: { 
	name: 'Turkey',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TT: { 
	name: 'Trinidad and Tobago',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TW: { 
	name: 'Taiwan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	TZ: { 
	name: 'Tanzania',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	UA: { 
	name: 'Ukraine',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	UG: { 
	name: 'Uganda',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	US: { 
	name: 'United States',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	UY: { 
	name: 'Uruguay',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	UZ: { 
	name: 'Uzbekistan',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	VE: { 
	name: 'Venezuela',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	VN: { 
	name: 'Vietnam',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	VU: { 
	name: 'Vanuatu',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	YE: { 
	name: 'Yemen',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ZA: { 
	name: 'South Africa',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ZM: { 
	name: 'Zambia',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	},

	ZW: { 
	name: 'Zimbabwe',
	description: 'default',
	color: 'default',
	hover_color: 'default',
	url: 'default'
	}//Note:  You must omit the comma after the last property in an object to prevent errors in internet explorer.
},

// You must number locations sequentially
locations: {
    0: {
        name: 'Athens',
        country: 'Greece',
        noc: 'GRE',
        summer: 'I',
        winter: 0,
        year: [1896, 2004],
        lat: 37.9833333,
        lng: 23.7333336,
        x: 1111,
        y: 257
    },
    1: {
        name: 'Paris',
        country: 'France',
        noc: 'FRA',
        summer: 'II',
        winter: 0,
        year: [1900, 1924],
        lat: 48.85341,
        lng: 2.3487999,
        x: 997,
        y: 189
    },
    2: {
        name: 'St. Louis',
        country: 'United States',
        noc: 'USA',
        summer: 'III',
        winter: 0,
        year: 1904,
        lat: 38.6272733,
        lng: -90.1978912,
        x: 511,
        y: 253
    },
    3: {
        name: 'London',
        country: 'United Kingdom',
        noc: 'GBR',
        summer: 'IV',
        winter: 0,
        year: [1908,1948, 2012],
        lat: 51.5084153,
        lng: -0.1255327,
        x: 985,
        y: 172
    },
    4: {
        name: 'Stockholm',
        country: 'Sweden',
        noc: 'SWE',
        summer: 'V',
        winter: 0,
        year: 1912,
        lat: 59.3325765,
        lng: 18.0649033,
        x: 1068,
        y: 125
    },
    5: {
        name: 'Antwerp',
        country: 'Belgium',
        noc: 'BEL',
        summer: 'VII',
        winter: 0,
        year: 1920,
        lat: 51.2166667,
        lng: 4.4166665,
        x: 1007,
        y: 174
    },
    6: {
        name: 'Chamonix',
        country: 'France',
        noc: 'FRA',
        summer: 0,
        winter: 'I',
        year: 1924,
        lat: 45.9237,
        lng: 6.8694,
        x: 1021,
        y: 207
    },
    8: {
        name: 'St. Moritz',
        country: 'Switzerland',
        noc: 'SUI',
        summer: 0,
        winter: 'II',
        year: 1928,
        lat: 46.4908,
        lng: 9.8355,
        x: 1035,
        y: 203
    },
    9: {
        name: 'Amsterdam',
        country: 'Netherlands',
        noc: 'NED',
        summer: 'IX',
        winter: 0,
        year: 1928,
        lat: 52.3075,
        lng: 4.9722219,
        x: 1010,
        y: 167
    },
    10: {
        name: 'Lake Placid',
        country: 'United States',
        noc: 'USA',
        summer: 0,
        winter: 'III',
        year: [1932, 1984],
        lat: 27.2931,
        lng: -81.362846,
        x: 540,
        y: 326
    },
    11: {
        name: 'Los Angeles',
        country: 'United States',
        noc: 'USA',
        summer: 'X',
        winter: 0,
        year: 1932,
        lat: 34.0522342,
        lng: -118.2436829,
        x: 351,
        y: 283
    },
    12: {
        name: 'Garmisch-Partenkirchen',
        country: 'Germany',
        noc: 'GER',
        summer: 0,
        winter: 'IV',
        year: 1936,
        lat: 47.49209,
        lng: 11.09576,
        x: 1041,
        y: 197
    },
    13: {
        name: 'Berlin',
        country: 'Germany',
        noc: 'GER',
        summer: 'XI',
        winter: 0,
        year: 1936,
        lat: 52.5166667,
        lng: 13.3999996,
        x: 1051,
        y: 166
    },
    14: {
        name: 'St. Moritz',
        country: 'Switzerland',
        noc: 'SUI',
        summer: 0,
        winter: 'V',
        year: 1948,
        lat: 46.4908,
        lng: 9.8355,
        x: 1035,
        y: 203
    },
    16: {
        name: 'Oslo',
        country: 'Norway',
        noc: 'NOR',
        summer: 0,
        winter: 'VI',
        year: 1952,
        lat: 60.1755556,
        lng: 24.934166,
        x: 1099,
        y: 120
    },
    17: {
        name: 'Helsinki',
        country: 'Finland',
        noc: 'FIN',
        summer: 'XV',
        winter: 0,
        year: 1952,
        lat: 60.1699,
        lng: 24.9384,
        x: 1099,
        y: 120
    },
    18: {
        name: "Cortina d'Ampezzo",
        country: 'Italy',
        noc: 'ITA',
        summer: 0,
        winter: 'VII',
        year: 1956,
        lat: 46.5405,
        lng: 12.1357,
        x: 1047,
        y: 203
    },
    19: {
        name: 'Melbourne',
        country: 'Australia',
        noc: 'AUS',
        summer: 'XVI',
        winter: 0,
        year: 1956,
        lat: -37.8139966,
        lng: 144.9633179,
        x: 1751,
        y: 744
    },
    20: {
        name: 'Stockholm',
        country: 'Sweden',
        noc: 'SWE',
        summer: 'XVI',
        winter: 0,
        year: 1956,
        lat: 59.3325765,
        lng: 18.0649033,
        x: 1068,
        y: 125
    },
    21: {
        name: 'Squaw Valley',
        country: 'United States',
        noc: 'USA',
        summer: 0,
        winter: 'VIII',
        year: 1960,
        lat: 39.1963,
        lng: -120.2336,
        x: 355,
        y: 249
    },
    22: {
        name: 'Rome',
        country: 'Italy',
        noc: 'ITA',
        summer: 'XVII',
        winter: 0,
        year: 1960,
        lat: 41.9,
        lng: 12.4833336,
        x: 1050,
        y: 232
    },
    23: {
        name: 'Innsbruck',
        country: 'Austria',
        noc: 'AUT',
        summer: 0,
        winter: 'IX',
        year: 1964,
        lat: 47.2666667,
        lng: 11.3999996,
        x: 1043,
        y: 199
    },
    24: {
        name: 'Tokyo',
        country: 'Japan',
        noc: 'JPN',
        summer: 'XVIII',
        winter: 0,
        year:  [1964,2020], 
        lat: 35.6895266,
        lng: 139.6916809,
        x: 1730,
        y: 272
    },
    25: {
        name: 'Grenoble',
        country: 'France',
        noc: 'FRA',
        summer: 0,
        winter: 'X',
        year: 1968,
        lat: 45.1666667,
        lng: 5.7166667,
        x: 1015,
        y: 212
    },
    26: {
        name: 'Mexico City',
        country: 'Mexico',
        noc: 'MEX',
        summer: 'XIX',
        winter: 0,
        year: 1968,
        lat: 19.4341667,
        lng: -99.1386108,
        x: 433,
        y: 377
    },
    27: {
        name: 'Sapporo',
        country: 'Japan',
        noc: 'JPN',
        summer: 0,
        winter: 'XI',
        year: 1972,
        lat: 43.0547222,
        lng: 141.3538818,
        x: 1712,
        y: 225
    },
    28: {
        name: 'Munich',
        country: 'West Germany',
        noc: 'GER',
        summer: 'XX',
        winter: 0,
        year: 1972,
        lat: 48.1351,
        lng: 11.582,
        x: 1044,
        y: 193
    },
    29: {
        name: 'Innsbruck',
        country: 'Austria',
        noc: 'AUT',
        summer: 0,
        winter: 'XII',
        year: 1976,
        lat: 47.2666667,
        lng: 11.3999996,
        x: 1043,
        y: 199
    },
    30: {
        name: 'Montreal',
        country: 'Canada',
        noc: 'CAN',
        summer: 'XXI',
        winter: 0,
        year: 1976,
        lat: 45.5167792,
        lng: -73.6491776,
        x: 613,
        y: 210
    },
    32: {
        name: 'Moscow',
        country: 'Soviet Union',
        noc: 'RUS',
        summer: 'XXII',
        winter: 0,
        year: 1980,
        lat: 55.7522222,
        lng: 37.6155548,
        x: 1163,
        y: 146
    },
    33: {
        name: 'Sarajevo',
        country: 'Yugoslavia',
        noc: 'RUS',
        summer: 0,
        winter: 'XIV',
        year: 1984,
        lat: 43.85,
        lng: 18.3833332,
        x: 1080,
        y: 220
    },
    34: {
        name: 'Los Angeles',
        country: 'United States',
        noc: 'USA',
        summer: 'XXIII',
        winter: 0,
        year: 1984,
        lat: 34.0522342,
        lng: -118.2436829,
        x: 351,
        y: 283
    },
    35: {
        name: 'Calgary',
        country: 'Canada',
        noc: 'CAN',
        summer: 0,
        winter: 'XV',
        year: 1988,
        lat: 51.0501123,
        lng: -114.085289,
        x: 429,
        y: 175
    },
    36: {
        name: 'Seoul',
        country: 'South Korea',
        noc: 'KOR',
        summer: 'XXIV',
        winter: 0,
        year: 1988,
        lat: 37.5663889,
        lng: 126.9997253,
        x: 1657,
        y: 260
    },
    37: {
        name: 'Albertville',
        country: 'France',
        noc: 'FRA',
        summer: 0,
        winter: 'XVI',
        year: 1992,
        lat: 45.6755,
        lng: 6.3927,
        x: 1018,
        y: 209
    },
    38: {
        name: 'Barcelona',
        country: 'Spain',
        noc: 'ESP',
        summer: 'XXV',
        winter: 0,
        year: 1992,
        lat: 41.3887869,
        lng: 2.1589851,
        x: 997,
        y: 235
    },
    39: {
        name: 'Lillehammer',
        country: 'Norway',
        noc: 'NOR',
        summer: 0,
        winter: 'XVII',
        year: 1994,
        lat: 61.1153,
        lng: 10.4662,
        x: 1033,
        y: 114
    },
    40: {
        name: 'Atlanta',
        country: 'United States',
        noc: 'USA',
        summer: 'XXVI',
        winter: 0,
        year: 1996,
        lat: 33.7489954,
        lng: -84.3879852,
        x: 533,
        y: 285
    },
    41: {
        name: 'Nagano',
        country: 'Japan',
        noc: 'JPN',
        summer: 0,
        winter: 'XVIII',
        year: 1998,
        lat: 36.65,
        lng: 138.1833344,
        x: 1719,
        y: 266
    },
    42: {
        name: 'Sydney',
        country: 'Australia',
        noc: 'AUS',
        summer: 'XXVII',
        winter: 0,
        year: 2000,
        lat: -33.86785,
        lng: 151.2073212,
        x: 1798,
        y: 719
    },
    43: {
        name: 'Salt Lake City',
        country: 'United States',
        noc: 'USA',
        summer: 0,
        winter: 'XIX',
        year: 2002,
        lat: 40.758701,
        lng: -111.876183,
        x: 404,
        y: 239
    },
    45: {
        name: 'Turin',
        country: 'Italy',
        noc: 'ITA',
        summer: 0,
        winter: 'XX',
        year: 2006,
        lat: 45.0703,
        lng: 7.6869,
        x: 1025,
        y: 212
    },
    46: {
        name: 'Beijing',
        country: 'China',
        noc: 'CHN',
        summer: 'XXIX',
        winter: 0,
        year: 2008,
        lat: 39.9074977,
        lng: 116.3972244,
        x: 1595,
        y: 245
    },
    47: {
        name: 'Vancouver',
        country: 'Canada',
        noc: 'CAN',
        summer: 0,
        winter: 'XXI',
        year: 2010,
        lat: 49.2496574,
        lng: -123.119339,
        x: 377,
        y: 186
    },
    49: {
        name: 'Sochi',
        country: 'Russia',
        noc: 'RUS',
        summer: 0,
        winter: 'XXII',
        year: 2014,
        lat: 43.6,
        lng: 39.730278,
        x: 1189,
        y: 222
    },
    50: {
        name: 'Rio de Janeiro',
        country: 'Brazil',
        noc: 'BRA',
        summer: 'XXXI',
        winter: 0,
        year: 2016,
        lat: -22.9027778,
        lng: -43.2075005,
        x: 747,
        y: 648
    }
}
}