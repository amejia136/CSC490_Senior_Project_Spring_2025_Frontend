import React, { useState } from 'react';
import "./Details.css";
import {arrayUnion, doc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from '../../firebaseConfig'
import stateImages from "../../Assets/stateImages";
import { getAuth } from 'firebase/auth';
import Aos from 'aos';
import 'aos/dist/aos.css';




const DetailsPage = () => {
    const [selectedState, setSelectedState] = useState('');
    const [stateInfo, setStateInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [showAddCommentForm, setShowAddCommentForm] = useState(false);
    const [newComment, setNewComment] = useState({ comment: '', place: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);



    const allStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
    ];
    const handleStateChange = async (event) => {
        const state = event.target.value;
        setSelectedState(state);
        setStateInfo(null);
        setComments([]);
        setShowComments(false);
        setShowAddCommentForm(false);

        if (state) {
            const locationDocRef = doc(db, 'Locations', state);
            try {
                const docSnap = await getDoc(locationDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data && data.Comments) {
                        setComments(data.Comments);
                    }
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }
    let details = null;
        if (state === 'Alabama') {
            details = {
                whyVisit: 'Alabama offers a rich tapestry of history and natural beauty. Explore the Civil Rights Trail in Birmingham and Montgomery, relax on the Gulf Coast beaches of Mobile, and marvel at the U.S. Space & Rocket Center in Huntsville. The best times to visit are spring and fall when the weather is mild and the landscapes are vibrant.',
            };
        } else if (state === 'Alaska') {
            details = {
                whyVisit: 'Alaska is a haven for nature enthusiasts, offering unparalleled wilderness experiences. Anchorage serves as a gateway to the state\'s vast landscapes, while Juneau provides access to the stunning Mendenhall Glacier. Fairbanks is renowned for its Northern Lights displays during the winter months. The best time to visit Alaska is during the summer, from May 10 to September 15, when temperatures are milder, daylight hours are extended, and most tourist services are operational. This period is ideal for wildlife viewing, hiking, and exploring national parks like Denali and Glacier Bay. ',
            }
        } else if (state === 'Arizona') {
            details = {
                whyVisit: 'Arizona is home to some of the most iconic landscapes in the U.S., including the breathtaking Grand Canyon, the striking red rocks of Sedona, and the cactus-filled expanses of Saguaro National Park. Cities like Phoenix, Tucson, and Flagstaff blend modern comfort with Southwestern charm, offering art, cuisine, and culture influenced by Native American and Mexican heritage.\n The best time to visit is fall to spring (October to April), when temperatures are mild and perfect for hiking or sightseeing. Arizona’s traditions shine in events like Native American festivals, Day of the Dead celebrations, and rodeo shows, making it a destination rich in both natural beauty and cultural depth.',
            };
        } else if (state === 'Arkansas') {
            details = {
                whyVisit: 'Arkansas, known as The Natural State, is filled with scenic mountains, lush forests, and relaxing hot springs. Explore the Ozark Mountains, soak in the waters at Hot Springs National Park, or go digging for real gems at the Crater of Diamonds State Park. Cities like Little Rock, Fayetteville, and Hot Springs offer a blend of history, culture, and outdoor fun.\n The best time to visit is spring and fall, when the weather is pleasant and the foliage is stunning. Arkansas traditions include bluegrass festivals, craft fairs, and classic Southern food festivals, offering a taste of local life in a laid-back, welcoming atmosphere.',
            };
        } else if (state === 'California') {
            details = {
                whyVisit: 'California is a dream destination with something for everyone—iconic cities, stunning nature, and diverse culture. Stroll along Hollywood Boulevard in Los Angeles, explore tech-savvy San Francisco, or unwind on the beaches of San Diego. Nature lovers can hike in Yosemite, marvel at the Redwoods, or sip wine in Napa Valley.\n' +
                    '\n' + 'The best time to visit varies by region—spring and fall offer ideal weather statewide. California celebrates everything from film and music festivals to cultural parades and surf competitions, making it a vibrant place to experience year-round energy and excitement.',
            };
        } else if (state === 'Colorado') {
            details = {
                whyVisit: 'Colorado is a haven for outdoor lovers, offering majestic Rocky Mountains, world-class ski resorts, and scenic gems like Garden of the Gods and Mesa Verde National Park. Cities like Denver and Boulder blend urban culture with mountain charm, featuring vibrant art scenes, breweries, and festivals.\n' +
                    '\n' + 'Visit in winter for skiing or summer for hiking, rafting, and music festivals in the cool mountain air. Don’t miss Telluride Bluegrass Festival, Denver’s Oktoberfest, and local traditions like cowboy rodeos and wildflower season. Colorado is all about nature, adventure, and a laid-back, high-altitude vibe.',
            };
        } else if (state === 'Connecticut') {
            details = {
                whyVisit: 'Connecticut combines small-town charm with rich history and coastal beauty. Explore historic seaports like Mystic, stroll through scenic towns like New Haven (home to Yale University), or enjoy cultural experiences in Hartford. The Connecticut River Valley and Litchfield Hills offer picturesque drives and outdoor escapes.\n' +
                    '\n' + 'The best times to visit are spring and fall, when blooming gardens and fiery foliage take center stage. Celebrate traditions like the Durham Fair, enjoy harvest festivals, or take a leaf-peeping tour. Whether you\'re into colonial history, seafood, or scenic escapes, Connecticut delivers classic New England charm.',
            };
        } else if (state === 'Delaware') {
            details = {
                whyVisit: 'Delaware may be the second smallest state, but it’s full of hidden gems. Stroll along the charming boardwalks of Rehoboth Beach, explore colonial history in New Castle, or shop tax-free in Wilmington. Nature lovers will enjoy Cape Henlopen State Park, known for its beaches, dunes, and wildlife.\n' +
                    '\n' + 'The best times to visit are late spring to early fall, when coastal towns are lively and the weather is ideal. Delaware celebrates with events like the Delaware State Fair and Sea Witch Festival in October. With its mix of history, beaches, and festivals, Delaware offers a relaxing and enriching getaway.',
            };
        } else if (state === 'Florida') {
            details = {
                whyVisit: 'Florida is a year-round playground known for its sunshine, beaches, and thrill-filled attractions. While spring (March to May) is ideal for avoiding summer crowds, there\'s never really a bad time to go. In Miami, soak up vibrant nightlife, Latin-inspired cuisine, and art deco flair along South Beach. Orlando is the ultimate family getaway with world-famous theme parks like Disney World and Universal Studios. For a more relaxed coastal vibe, explore the white sands of Tampa or the historic charm of St. Augustine, the oldest city in the U.S. From the tropical wetlands of the Everglades to Key lime pie in Key West, Florida offers something for every kind of traveler.',
            };
        } else if (state === 'Georgia') {
            details = {
                whyVisit: 'Georgia is where history, culture, and nature come together with true Southern hospitality. In Atlanta, explore the Georgia Aquarium, World of Coca-Cola, and the legacy of Dr. Martin Luther King Jr.. Head to Savannah for cobblestone streets, oak-lined squares, and historic architecture. For outdoor adventure, visit Blue Ridge or hike the Appalachian Trail.\n' +
                    '\n' + 'The best time to visit is in the spring (March to May) or fall (September to November) when the weather is pleasant and festivals are in full swing. Don’t miss the Atlanta Dogwood Festival, Peach Festival, or a traditional Southern tailgate during football season. Georgia blends old-world charm with modern energy, making it a diverse and unforgettable destination.',
            };
        } else if (state === 'Hawaii') {
            details = {
                whyVisit: 'Hawaii is a tropical paradise made up of stunning islands, each with its own unique vibe. Oahu offers the vibrant city life of Honolulu and the historic Pearl Harbor, along with famous surf beaches like Waikiki and North Shore. Maui is perfect for relaxing on golden beaches, exploring the Road to Hana, or watching sunrise at Haleakalā. For volcano lovers, Hawai\'i (Big Island) features Hawai’i Volcanoes National Park, while Kauai, the “Garden Isle,” is lush and tranquil with jaw-dropping spots like Waimea Canyon.',
            };
        } else if (state === 'Idaho') {
            details = {
                whyVisit: 'Idaho is an underrated treasure for outdoor lovers, known for its rugged wilderness, scenic landscapes, and friendly small towns. Boise, the capital, has a lively downtown with art, music, and riverfront parks. Nature enthusiasts will love Sun Valley for skiing, Coeur d’Alene for lakeside relaxation, and Sawtooth National Recreation Area for hiking and stargazing. The Shoshone Falls, often called the “Niagara of the West,” is a must-see.\n' +
                    '\n' + 'The best time to visit is late spring through early fall for hiking, rafting, and festivals—or winter for snow sports. Idaho also celebrates traditions like Western heritage festivals, rodeo events, and the quirky Potato Drop on New Year’s Eve in Boise. Whether you\'re seeking adventure or tranquility, Idaho has the charm and space to explore freely.',
            };
        } else if (state === 'Illinois') {
            details = {
                whyVisit: 'Illinois offers the perfect mix of urban excitement and Midwestern warmth. Chicago, the state\'s crown jewel, dazzles with world-class museums, deep-dish pizza, iconic architecture, and Lake Michigan’s scenic waterfront. Explore Millennium Park, catch a show in the theater district, or ride to the top of Willis Tower. Beyond the city, you’ll find charming towns like Galena, known for its historic Main Street, and Springfield, the home of Abraham Lincoln.\n' +
                    '\n' + 'The best time to visit is spring through fall, when festivals like Lollapalooza, the Taste of Chicago, and state fairs are in full swing. Illinois also embraces traditions like Chicago’s St. Patrick’s Day Parade, where they famously dye the river green, and countless harvest festivals across the state. From urban adventures to peaceful countryside escapes, Illinois offers a little bit of everything.',
            };
        } else if (state === 'Indiana') {
            details = {
                whyVisit: 'Indiana is a heartland gem where friendly communities, scenic byways, and iconic events come together. The capital city, Indianapolis, offers attractions like the Indianapolis Motor Speedway, home of the world-famous Indy 500, as well as the sprawling White River State Park and an acclaimed children’s museum. Small towns like Nashville (in Brown County) and Madison charm visitors with local art, antique shops, and fall foliage.The best time to visit is late spring through fall, especially around May for race season and during autumn for festivals and scenic drives.',
            };
        } else if (state === 'Iowa') {
            details = {
                whyVisit: 'Iowa offers a surprising blend of picturesque landscapes and vibrant city life. Beyond the rolling cornfields, you\'ll discover charming towns, historical sites, and a welcoming atmosphere. Consider visiting Des Moines, the capital city, where you can tour the impressive State Capitol building or explore the Pappajohn Sculpture Park. Iowa City, a UNESCO City of Literature, boasts a lively downtown and a rich literary history. In the eastern part of the state, Dubuque offers scenic Mississippi River views and the National Mississippi River Museum & Aquarium. While organized tours of these main cities might be limited, you can often find guided historical walks or utilize resources for self-guided explorations to delve into their unique character.',
            };
        } else if (state === 'Kansas') {
            details = {
                whyVisit: 'Kansas offers wide open skies, rolling prairies, and classic small-town charm. Wichita, the largest city, is known for its museums and thriving arts scene, while places like Dodge City bring Wild West history to life. Visit in spring (April–May) or fall (September–October) for the best weather and colorful scenery across the plains.',
            };
        } else if (state === 'Kentucky') {
            details = {
                whyVisit: 'Kentucky is famous for bourbon, bluegrass music, and horse racing. Louisville is home to the iconic Kentucky Derby and a vibrant food scene, while Lexington is the heart of horse country. The scenic beauty of the Red River Gorge and Mammoth Cave National Park also draws outdoor enthusiasts. Spring (April–May) and fall (September–October) are the best times to visit for festivals and outdoor adventures.',
            };
        } else if (state === 'Louisiana') {
            details = {
                whyVisit: 'Louisiana is full of culture, music, and delicious food. New Orleans is the star with its French Quarter, jazz music, and incredible cuisine, but Baton Rouge and Lafayette also offer rich history and vibrant local scenes. Visit during spring (February–April) for Mardi Gras and festival season, or fall (October–November) for cooler weather and fewer crowds.',
            };
        } else if (state === 'Maine') {
            details = {
                whyVisit: 'Maine is all about rugged coastlines, charming seaside towns, and outdoor adventure. Portland offers a trendy small-city vibe with fantastic food, while Acadia National Park provides stunning hikes and ocean views. Summer (June–August) is perfect for exploring the coast, but fall (September–October) is breathtaking with crisp air and colorful foliage.\n' +
                    '\n',
            };
        } else if (state === 'Maryland') {
            details = {
                whyVisit: 'Maryland packs a lot into a small state, from historic seaports to beautiful mountain trails. Baltimore is the major city, famous for its Inner Harbor, vibrant arts scene, and seafood — especially blue crabs. Annapolis, the capital, is known for its sailing and colonial history. Summer (June–August) is lively for waterfront fun, but fall (September–October) offers beautiful foliage and fewer crowds.',
            };
        } else if (state === 'Massachusetts') {
            details = {
                whyVisit: 'Massachusetts is a perfect blend of history, culture, and coastal beauty. Boston, the largest city, offers iconic landmarks like the Freedom Trail and Fenway Park. Beyond the city, Cape Cod provides beaches and seaside villages, while the Berkshires deliver scenic drives and arts festivals. Late spring (May–June) and fall (September–October) are the best times to visit for pleasant weather and seasonal events.',
            };
        } else if (state === 'Michigan') {
            details = {
                whyVisit: 'Michigan is a water lover\'s paradise, surrounded by the Great Lakes and dotted with charming towns. Detroit is the comeback city, rich in music and automotive history, while Ann Arbor buzzes with college town energy. Northern Michigan offers stunning spots like Traverse City and Mackinac Island. Summer (June–August) is the best time for lake activities, while fall brings spectacular leaf peeping.',
            };
        } else if (state === 'Minnesota') {
            details = {
                whyVisit: 'Minnesota, the "Land of 10,000 Lakes," offers a mix of natural beauty and lively cities. Minneapolis and St. Paul, the Twin Cities, are known for their arts, music, and great food scenes. The North Shore along Lake Superior is a dream for hikers and nature lovers. Visit in summer (June–August) for the best weather or in fall (September–October) to see breathtaking autumn colors.',
            };
        } else if (state === 'Mississippi') {
            details = {
                whyVisit: 'Mississippi is rich in culture, music, and Southern hospitality. Jackson, the capital, offers museums and civil rights history, while towns like Oxford and Natchez charm with historic homes and lively downtowns. Music lovers will enjoy exploring the birthplace of blues along the Mississippi Blues Trail. The best times to visit are spring (March–May) and fall (September–November), when the weather is mild and festivals are in full swing.',
            };
        } else if (state === 'Missouri') {
            details = {
                whyVisit: 'Missouri is a diverse state with big cities and beautiful nature. St. Louis is famous for the Gateway Arch, live music, and great food, while Kansas City shines with jazz heritage and delicious barbecue. Outdoor enthusiasts can explore the Ozark Mountains and float the scenic rivers. Visit in spring (April–June) or fall (September–October) for comfortable temperatures and colorful landscapes.',
            };
        } else if (state === 'Montana') {
            details = {
                whyVisit: 'Montana, known as "Big Sky Country," offers some of the most breathtaking landscapes in the U.S. Major cities like Billings and Missoula are laid-back gateways to adventure, but the real draw is nature — Glacier National Park, Yellowstone’s northern entrance, and endless outdoor activities. Summer (June–September) is ideal for hiking, camping, and exploring the wide-open spaces.',
            };
        } else if (state === 'Nebraska') {
            details = {
                whyVisit: 'Nebraska is full of hidden gems, from rolling prairies to lively cities like Omaha and Lincoln. Omaha boasts a great zoo, a lively music scene, and trendy neighborhoods, while Lincoln is home to a charming college-town vibe. Don’t miss the scenic Sandhills or Chimney Rock for classic Great Plains beauty. Visit in spring (April–May) or fall (September–October) for the best weather.',
            };
        } else if (state === 'Nevada') {
            details = {
                whyVisit: 'Nevada is more than just Las Vegas — though the city’s entertainment, dining, and nightlife are world-famous! Reno and Lake Tahoe offer a mix of outdoor adventures and cultural experiences, and the vast deserts, like Red Rock Canyon and Great Basin National Park, showcase stunning natural beauty. Spring (March–May) and fall (September–November) are the best seasons to explore beyond the heat of summer.',
            };
        } else if (state === 'New Hampshire') {
            details = {
                whyVisit: 'New Hampshire is a beautiful New England state full of mountains, lakes, and charming small towns. The White Mountains are perfect for hiking, especially in fall when the foliage is breathtaking. Portsmouth offers coastal charm with historic streets and great seafood. Visit in fall (September–October) for amazing leaf-peeping, or in summer (June–August) for hiking and lakeside fun.',
            };
        } else if (state === 'New Jersey') {
            details = {
                whyVisit: 'New Jersey offers a mix of beaches, bustling cities, and historic landmarks. The Jersey Shore is famous for its lively boardwalks and beach towns, while cities like Newark and Princeton bring culture and history. You can also visit charming small towns and beautiful state parks. Summer (June–August) is ideal for beach trips, while fall (September–October) is great for cooler weather and outdoor festivals.',
            };
        } else if (state === 'New Mexico') {
            details = {
                whyVisit: 'New Mexico offers a unique blend of Native American heritage, Spanish influence, and stunning natural beauty. Explore Santa Fe for its vibrant art scene and historic charm, Albuquerque for the famous Balloon Fiesta and Route 66 nostalgia, and Taos for mountain views and rich culture. Top attractions include White Sands National Park, Carlsbad Caverns, and Chaco Culture National Historical Park.\n' +
                    '\n' + 'The best time to visit is fall (September to November), when the weather is pleasant and festivals like the Albuquerque International Balloon Fiesta are in full swing. New Mexico’s traditions shine through events like Zozobra, Fiestas de Santa Fe, and Pueblo Feast Days, offering deep cultural experiences. From fiery sunsets to flavorful green chile dishes, New Mexico is an unforgettable Southwest escape.',
            };
        } else if (state === 'New York') {
            details = {
                whyVisit: 'New York is a dynamic mix of big-city excitement, small-town charm, and natural beauty, making it a top destination any time of year—though fall (September to November) offers perfect weather and iconic foliage. New York City dazzles with iconic landmarks like the Statue of Liberty, Central Park, Broadway, and world-class museums. In upstate Buffalo and Rochester, discover the power of Niagara Falls or take scenic wine tours along the Finger Lakes. For outdoor enthusiasts, the Adirondacks and Catskills deliver year-round hiking, skiing, and leaf-peeping. Whether you\'re into culture, cuisine, or countryside, New York delivers it all in style.',
            };
        } else if (state === 'North Carolina') {
            details = {
                whyVisit: 'North Carolina offers a perfect blend of mountains, beaches, and charming cities. Asheville is famous for its artsy vibe and the stunning Blue Ridge Parkway, while Charlotte and Raleigh bring city energy and Southern hospitality. The Outer Banks offer scenic beaches and historic sites. Spring (April–June) and fall (September–November) are the best times for perfect weather and outdoor activities.',
            };
        } else if (state === 'North Dakota') {
            details = {
                whyVisit: 'North Dakota is all about wide-open spaces, rugged landscapes, and surprising history. Fargo, the biggest city, has a cool arts and culture scene, while Theodore Roosevelt National Park stuns with colorful badlands and wildlife. Visit in summer (June–August) for warm weather and outdoor adventures, as winters can be very harsh.',
            };
        } else if (state === 'Ohio') {
            details = {
                whyVisit: 'Ohio blends big city excitement with small-town charm. Columbus, Cleveland, and Cincinnati each offer great food, arts, and sports scenes. Beyond the cities, you can explore the rolling hills of Amish Country, Cedar Point amusement park, and Lake Erie shores. The best times to visit are spring (April–May) and fall (September–October), when temperatures are mild and events are in full swing.',
            };
        } else if (state === 'Oklahoma') {
            details = {
                whyVisit: 'Oklahoma offers a blend of Native American heritage, cowboy culture, and diverse natural landscapes. In Oklahoma City, explore the National Cowboy & Western Heritage Museum, Bricktown entertainment district, and the Oklahoma City National Memorial. Tulsa surprises visitors with its vibrant art deco architecture, Philbrook Museum, and live music scene.\n\nNature lovers can visit the Wichita Mountains Wildlife Refuge for hiking and bison spotting, or float the Illinois River near Tahlequah. Spring (April–June) and fall (September–October) are the best times to visit, offering mild weather, blooming wildflowers, and colorful foliage. From cultural festivals to Route 66 charm, Oklahoma is an underrated destination full of heart and history.',
            };
        } else if (state === 'Oregon') {
            details = {
                whyVisit: 'Oregon is a dream for nature lovers, with dramatic coastlines, lush forests, and towering mountains. Portland, the biggest city, is known for its artsy vibe, food trucks, and coffee culture. Beyond the city, explore Crater Lake National Park, the Columbia River Gorge, and the scenic Oregon Coast. The best time to visit is summer (June–September) for clear skies and outdoor adventures.',
            };
        } else if (state === 'Pennsylvania') {
            details = {
                whyVisit: 'Pennsylvania mixes rich history with modern fun. Philadelphia is famous for Independence Hall and the Liberty Bell, while Pittsburgh offers cool museums, sports, and revitalized neighborhoods. The countryside is beautiful too, especially in Amish Country and the Pocono Mountains. Visit in spring (April–June) or fall (September–October) for mild weather and colorful landscapes.',
            };
        } else if (state === 'Rhode Island') {
            details = {
                whyVisit: 'Rhode Island, the smallest U.S. state, is big on charm and coastal beauty. Providence, the capital, boasts a lively arts and food scene, while Newport is famous for its historic mansions and scenic coastline. Beaches, sailing, and seafood make summer (June–August) the perfect time to visit, though fall brings lovely leaf-peeping with fewer crowds.',
            };
        } else if (state === 'South Carolina') {
            details = {
                whyVisit: 'South Carolina offers beautiful beaches, historic towns, and southern hospitality. Charleston charms with cobblestone streets and antebellum architecture, while Myrtle Beach is famous for family-friendly fun and miles of sandy shore. Spring (March–May) and fall (September–November) are the best times to visit for pleasant weather and blooming gardens.\n' +
                    '\n',
            };
        } else if (state === 'South Dakota') {
            details = {
                whyVisit: 'South Dakota is packed with big sights and wild landscapes. Rapid City is a great base for visiting Mount Rushmore, the Badlands, and Custer State Park. In the Black Hills, you’ll find stunning drives and outdoor adventure. Summer (June–August) is ideal for sightseeing, while September brings cooler weather and fewer crowds.\n' + '\n',
            };
        } else if (state === 'Tennessee') {
            details = {
                whyVisit: 'Tennessee blends music, mountains, and Southern charm into one unforgettable destination. Nashville, known as "Music City," offers a vibrant country music scene, while Memphis brings the blues and delicious BBQ. Outdoor lovers flock to the Great Smoky Mountains National Park for hiking and stunning scenery. Spring (April–May) and fall (September–October) are ideal for visiting, with mild weather and colorful landscapes',
            };
        } else if (state === 'Texas') {
            details = {
                whyVisit: 'Texas is a massive state with an incredible variety of things to see and do. Major cities like Austin (known for live music and tech), Houston (for museums and space exploration), Dallas, and San Antonio (famous for the historic Alamo and River Walk) offer endless urban adventures. Beyond the cities, you\'ll find beautiful landscapes like Big Bend National Park and Hill Country. Visit in spring (March–May) or fall (October–November) to avoid the intense summer heat.',
            };
        } else if (state === 'Utah') {
            details = {
                whyVisit: 'Utah is a paradise for outdoor adventure and jaw-dropping scenery. Salt Lake City is the vibrant urban hub, but the real magic lies in the state\'s "Mighty 5" national parks — Zion, Bryce Canyon, Arches, Canyonlands, and Capitol Reef. From red rock canyons to snow-capped peaks, Utah’s landscapes are unforgettable. Best times to visit are spring (April–May) and fall (September–October) when temperatures are perfect for hiking and exploring.',
            };
        } else if (state === 'Vermont') {
            details = {
                whyVisit: 'Vermont offers storybook New England charm with its rolling hills, covered bridges, and quaint towns like Burlington and Stowe. It’s famous for maple syrup, cozy inns, and stunning fall foliage. In winter, it becomes a skiing haven. Fall (late September–October) is absolutely the best time to visit for vibrant autumn colors, but summer is also perfect for hiking and enjoying the peaceful countryside.',
            };
        } else if (state === 'Virginia') {
            details = {
                whyVisit: 'Virginia, rich in American history and natural beauty, offers a little bit of everything. Major cities like Richmond and Virginia Beach mix colonial charm with lively modern culture, while areas like Williamsburg and Jamestown are must-visits for history buffs. Outdoor adventurers can explore the scenic Blue Ridge Mountains and Shenandoah National Park. Spring (April–June) and fall (September–November) are the best times to visit, offering perfect weather and colorful landscapes.\n' +
                    '\n',
            };
        } else if (state === 'Washington') {
            details = {
                whyVisit: 'Washington State is a haven for nature lovers and urban explorers alike. Seattle, its largest city, is famous for the Space Needle, Pike Place Market, and vibrant music and coffee scenes. Beyond the city, you’ll find the lush rainforests of Olympic National Park, the volcanic peaks of Mount Rainier, and the stunning coastline of the Puget Sound. Visit in summer (July–September) for the best weather and clearest mountain views, or in spring for blooming tulips and fewer crowds.',
            };
        } else if (state === 'West Virginia') {
            details = {
                whyVisit: 'West Virginia is a hidden gem packed with rugged mountains, charming small towns, and outdoor adventure. Key spots include Charleston, the relaxed state capital, and Harpers Ferry, a picturesque town rich in Civil War history. Outdoor enthusiasts love the state\'s excellent whitewater rafting, hiking, and rock climbing, especially in the New River Gorge National Park. The best times to visit are late spring (May–June) and fall (September–October) when the forests are green or blazing with autumn colors.\n' +
                    '\n',
            };
        } else if (state === 'Wisconsin') {
            details = {
                whyVisit: 'Wisconsin, known as "America’s Dairyland," is famous for its cheese, friendly towns, and beautiful natural landscapes. Major cities include Milwaukee known for its breweries, festivals, and the stunning Milwaukee Art Museum — and Madison, the state capital, which boasts a vibrant college town feel thanks to the University of Wisconsin-Madison. Outdoor lovers will enjoy the scenic beauty of Door County, the Apostle Islands, and the rolling hills of the Driftless Area. Summer (June–August) is a popular time to visit for festivals and lake activities, while fall (September–October) offers gorgeous autumn foliage.\n' +
                    '\n',
            };
        } else if (state === 'Wyoming') {
            details = {
                whyVisit: 'Wyoming is a rugged, adventure-filled state, home to some of America’s most iconic natural wonders. The main cities include Cheyenne, the charming capital known for its Old West history, and Jackson, a trendy town near the stunning Grand Teton National Park. Wyoming is also the gateway to Yellowstone National Park, famous for geysers like Old Faithful and abundant wildlife. Summer (June–September) is ideal for hiking, sightseeing, and outdoor adventures, while winter (December–March) transforms Jackson Hole into a top destination for skiing and snowboarding.\n' +
                    '\n',
            };
        }
        setStateInfo(details);
    };


    const handleNextImage = () => {
        if (!stateImages[selectedState]) return;
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % stateImages[selectedState].length);
    };

    const handlePrevImage = () => {
        if (!stateImages[selectedState]) return;
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + stateImages[selectedState].length) % stateImages[selectedState].length);
    };

    const handleCommentsClick = () => {
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!selectedState) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to leave a comment.");
            return;
        }

        const newCommentData = {
            UserID: user.displayName || user.email || user.uid,
            Comment: newComment.comment,
            recommendedName: newComment.place,
        };

        const locationDocRef = doc(db, 'Locations', selectedState);

        try {
            await updateDoc(locationDocRef, {
                Comments: arrayUnion(newCommentData),
            });

            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment({ comment: '', place: '' });
            setShowAddCommentForm(false);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <section className="detailPageSection">
            <div className="detailsContent container" data-aos="fade">
                <h2 className="detailsTitle" data-aos="zoom-in">Details!</h2>
                <p className="detailsIntro" data-aos="fade-in">Explore places so you can find your destination for your next trip.</p>

                <div className="dropdownContainer" data-aos="fade-up">
                    <select value={selectedState} onChange={handleStateChange} className="stateDropdown">
                        <option value="">Choose a state</option>
                        {Object.keys(stateImages).map((stateName) => (
                            <option key={stateName} value={stateName}>{stateName}</option>
                        ))}
                    </select>
                </div>


                {!selectedState && (
                    <div className="recommendedStates" data-aos="fade-up">
                        <h3 className="recommendedTitle"> Our Recommended Destinations for This Summer</h3>
                        {["Hawaii", "California", "Florida"].map((state) => (
                            <div key={state} className="stateDetails" data-aos="fade-up">
                                <h2>{state}</h2>
                                {stateImages[state] && (
                                    <div className="stateImagesCarousel">
                                        {stateImages[state].map((image, i) => (
                                            <img
                                                key={i}
                                                src={image}
                                                alt={`${state} ${i + 1}`}
                                                className="stateImage"
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="infoBox">
                                    <h4 className="infoTitle">Why Visit</h4>
                                    <p className="infoDesc">
                                        {{
                                            California:'California is a dream destination offering something for everyone—iconic cities, breathtaking nature, and vibrant culture. Explore Hollywood in Los Angeles, tech innovation in San Francisco, or relax on sunny beaches in San Diego. Nature lovers can visit Yosemite, hike among the Redwoods, or sip wine in Napa Valley.\n' + 'Best time to visit: Spring and fall for ideal weather, fewer crowds, and scenic beauty. Events like Coachella, film festivals, and food fairs showcase the state’s creative energy year-round.',
                                            Hawaii: 'Hawaii is a tropical paradise with unique islands, each offering its own vibe. Oahu combines city life in Honolulu with famous surf spots like North Shore. Maui boasts stunning beaches and scenic drives like the Road to Hana. The Big Island features active volcanoes, while Kauai charms with lush jungles and waterfalls.\n' +
                                                'Best time to visit: April to October for sunshine and ocean activities. Whether you\'re chasing sunsets, hula shows, or island hikes, Hawaii is the ultimate escape.',
                                            Florida: 'Florida is a year-round escape filled with sunshine, sandy beaches, and adventure. Visit Miami for its nightlife and art deco vibes, Orlando for world-famous theme parks like Disney and Universal, and the Keys for island charm. Explore natural wonders like the Everglades or relax along the Gulf Coast.\n' +
                                                'Best time to visit: Spring (March–May) offers warm weather and fewer crowds. Florida blends tropical fun with family attractions and rich culture all in one state. ',

                                        }[state]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedState && stateInfo && (
                    <div className="stateDetails" data-aos="fade">
                        <h2>{selectedState}</h2>
                        {stateInfo.whyVisit && (
                            <div className="infoBox">
                                <h4 className="infoTitle">Why Visit</h4>
                                <p className="infoDesc">{stateInfo.whyVisit}</p>
                            </div>
                        )}
                        {stateImages[selectedState] && (
                            <div className="stateImagesCarousel">
                                <button onClick={handlePrevImage} className="arrowButton">◀</button>
                                <img
                                    src={stateImages[selectedState][currentImageIndex]}
                                    alt={`${selectedState} ${currentImageIndex + 1}`}
                                    className="stateImage"
                                />
                                <button onClick={handleNextImage} className="arrowButton">▶</button>
                            </div>
                        )}

                        <button className="commentButton" onClick={handleCommentsClick}>
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </button>

                        {showComments && (
                            <div className="commentsSection">
                                <h3>User Recommendations</h3>
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <p><strong>User:</strong> {comment.UserID}</p>
                                            {comment.recommendedName && (
                                                <p><strong>Recommended Place:</strong> {comment.recommendedName}</p>
                                            )}
                                            <p><strong>Comment:</strong> {comment.Comment}</p>
                                            <hr />
                                        </div>
                                    ))
                                ) : (
                                    <p>No user recommendations yet for {selectedState}.</p>
                                )}

                                <button className="addCommentButton" onClick={() => setShowAddCommentForm(!showAddCommentForm)}>
                                    {showAddCommentForm ? 'Cancel' : 'Add a Comment'}
                                </button>

                                {showAddCommentForm && (
                                    <form className="addCommentForm" onSubmit={handleAddComment}>
                                        <input
                                            type="text"
                                            placeholder="Comment"
                                            value={newComment.comment}
                                            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Recommended Place Name"
                                            value={newComment.place}
                                            onChange={(e) => setNewComment({ ...newComment, place: e.target.value })}
                                        />
                                        <button type="submit">Submit Comment</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DetailsPage;