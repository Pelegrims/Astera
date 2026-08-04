/**
 * The city-timezones dataset covers the whole world, so US-specific
 * coverage isn't its focus, and population data for smaller US towns can
 * be patchy or missing. Since a US audience is the main market here, this
 * is a curated list of well-known major cities and state capitals — when
 * a match is one of these, it's boosted to the top of results regardless
 * of whatever population figure (or lack of one) the dataset has on file.
 *
 * This directly fixes cases like searching a state name ("New Jersey")
 * and getting obscure small towns ahead of Newark/Jersey City/Trenton.
 */
export const MAJOR_US_CITIES = new Set(
  [
    // Top ~100 US cities by population
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin",
    "Jacksonville", "Fort Worth", "San Jose", "Columbus", "Charlotte",
    "Indianapolis", "San Francisco", "Seattle", "Denver", "Oklahoma City",
    "Nashville", "El Paso", "Washington", "Boston", "Las Vegas",
    "Portland", "Detroit", "Louisville", "Memphis", "Baltimore",
    "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
    "Mesa", "Kansas City", "Atlanta", "Omaha", "Colorado Springs",
    "Raleigh", "Miami", "Long Beach", "Virginia Beach", "Oakland",
    "Minneapolis", "Tulsa", "Tampa", "Arlington", "New Orleans",
    "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim",
    "Honolulu", "Santa Ana", "Riverside", "Corpus Christi", "Lexington",
    "Stockton", "Henderson", "Saint Paul", "St. Louis", "Cincinnati",
    "Pittsburgh", "Greensboro", "Anchorage", "Plano", "Lincoln",
    "Orlando", "Irvine", "Newark", "Toledo", "Durham",
    "Chula Vista", "Fort Wayne", "Jersey City", "St. Petersburg", "Laredo",
    "Madison", "Chandler", "Buffalo", "Lubbock", "Scottsdale",
    "Reno", "Glendale", "Norfolk", "Chesapeake", "Garland",
    "Irving", "Hialeah", "Fremont", "Boise", "Richmond",
    "Baton Rouge", "Spokane", "Des Moines", "Tacoma", "San Bernardino",
    "Salt Lake City", "Grand Rapids", "Rochester", "Trenton", "Princeton",

    // State capitals not already covered above
    "Montgomery", "Juneau", "Little Rock", "Hartford", "Dover",
    "Tallahassee", "Springfield", "Topeka", "Frankfort",
    "Augusta", "Annapolis", "Jackson", "Jefferson City", "Helena",
    "Concord", "Santa Fe", "Bismarck",
    "Salem", "Providence", "Columbia", "Pierre", "Montpelier",
    "Charleston", "Cheyenne",
  ].map((c) => c.toLowerCase())
);
