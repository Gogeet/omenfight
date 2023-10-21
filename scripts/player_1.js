var whyIllegal = [0, 0, 0, 0, 0, 0]; //Too many points - Too many Powers - Illegal Powers for rank - Too many Proficiencies - Too many Saber Forms - Armour too heavy
var isLegal = controlLegallity();
var speciesSelect = document.getElementById('species_1');

speciesSelect.addEventListener('change', function() {
  player[2][0] = parseInt(speciesSelect.value);
  setSpecies();
});

var mods = {
    8: [-1, 0],
    9: [-1, 1],
    10: [0, 2],
    11: [0, 3],
    12: [1, 5],
    13: [1, 7],
    14: [2, 10],
    15: [2, 13],
    16: [3, 17],
    17: [3, 21],
    18: [4, 26],
    19: [4, 31],
    20: [5, 37]
};

var player = [
    [8, 8, 8, 8, 8],    // STR, DEX, CON, WIL, CHA (to be filled later)
    [],                 // HP, DEF, RES, INI
    [0],                // Species: 0 - Human / 1 - Cathar / 2 - Chiss / 3 - Cyborg / 4 - Echani / 5 - Miraluka / 6 - Mirialan / 7 - Rattataki / 8 - Sith Pureblood / 9 - Togruta / 10 - Twi'lek / 11 - Zabrak
    [0],                // Weapon: 0 - Lightsaber, 1 - Saberstaff, 2 - Dual Wield / 10 - Practice saber, 11 - Practice Saberstaff, 12 - Practice Dual Wield
    [0, 0],             // Force powers chosen, Force powers available
    [0, 0],             // Proficiencies used / Proficiencies available
    [0, 0],             // Points used / Points available
    [                   // Force powers selected (Control / Sense / Alter / Basic / Affinities)
      [0, 0, 0, 0],
      [0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0]
    ]
];

var chosenPowers = 0;

function updateModifiers() {
    var strInput = document.getElementById("str_1");
    var dexInput = document.getElementById("dex_1");
    var conInput = document.getElementById("con_1");
    var wilInput = document.getElementById("wil_1");
    var chaInput = document.getElementById("cha_1");

    var str = parseInt(strInput.value, 10);
    var dex = parseInt(dexInput.value, 10);
    var con = parseInt(conInput.value, 10);
    var wil = parseInt(wilInput.value, 10);
    var cha = parseInt(chaInput.value, 10);

    // Ensure the input values are within the valid range of 8 to 20
    str = Math.max(8, Math.min(20, str));
    dex = Math.max(8, Math.min(20, dex));
    con = Math.max(8, Math.min(20, con));
    wil = Math.max(8, Math.min(20, wil));
    cha = Math.max(8, Math.min(20, cha));

    // Update the input values with the corrected values
    strInput.value = str;
    dexInput.value = dex;
    conInput.value = con;
    wilInput.value = wil;
    chaInput.value = cha;

    player[0] = [mods[str][0], mods[dex][0], mods[con][0], mods[wil][0], mods[cha][0]];
    player[6][0] = mods[str][1] + mods[dex][1] + mods[con][1] + mods[wil][1] + mods[cha][1];
        
    console.log(player[0]);

    // Update the HP value
    updateLevelOptions();
    isLegal = controlLegallity();
    controlAmountForcePowers();
}

document.addEventListener("DOMContentLoaded", function() {
    var strInput = document.getElementById("str_1");
    var dexInput = document.getElementById("dex_1");
    var conInput = document.getElementById("con_1");
    var wilInput = document.getElementById("wil_1");
    var chaInput = document.getElementById("cha_1");

    strInput.addEventListener("change", updateModifiers);
    dexInput.addEventListener("change", updateModifiers);
    conInput.addEventListener("change", updateModifiers);
    wilInput.addEventListener("change", updateModifiers);
    chaInput.addEventListener("change", updateModifiers);

    // Call updateLevelOptions on initial page load
    updateLevelOptions();
    isLegal = controlLegallity();
    controlAmountForcePowers();
});

const levelOptions = {
    aco: ["I", "II", "III", "IV", "V"],
    neo: ["I", "II", "III"],
    app: ["I", "II", "III", "IV", "V"],
    lor: ["I", "II", "III", "IV", "V"],
    dar: ["I", "II", "III"],
};

// Points, Starting HP, Force powers available, Proficiencies Available, Proficiencies Bonus, Saber masteries
const rankLevelsMap = {
    aco: {
        I: [10, 5, 1, 1, 1, 1],
        II: [14, 5, 2, 1, 2, 1],
        III: [18, 5, 2, 2, 2, 1],
        IV: [22, 5, 4, 3, 2, 1],
        V: [25, 5, 5, 3, 2, 1]
    },
    neo: {
        I: [27, 10, 6, 3, 2, 1],
        II: [30, 10, 7, 4, 2, 2],
        III: [35, 10, 8, 5, 2, 2]
    },
    app: {
        I: [38, 10, 8, 5, 2, 2],
        II: [40, 12, 9, 6, 2, 3],
        III: [43, 13, 9, 6, 3, 3],
        IV: [46, 14, 9, 6, 3, 3], 
        V: [50, 15, 10, 6, 3, 3]
    },
    lor: {
        I: [52, 17, 11, 6, 3, 3],
        II: [58, 19, 11, 6, 4, 3],
        III: [63, 22, 13, 7, 4, 4],
        IV: [68, 23, 14, 7, 4, 4],
        V: [72, 25, 15, 7, 4, 4]
    },
    dar: {
        I: [75, 30, 15, 8, 4, 4],
        II: [80, 35, 18, 9, 5, 5],
        III: [85, 40, 20, 10, 5, 5]
    }
};

// Get the rank and level select elements
const rankSelect = document.getElementById("rank_1");
const levelSelect = document.getElementById("level_1");

// Function to update the level select options based on the selected rank
function updateLevelOptions() {
  const selectedRank = rankSelect.value;
  const levels = levelOptions[selectedRank];

  levelSelect.innerHTML = "";

  levels.forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.text = level;
    levelSelect.appendChild(option);
  });

  updateLevel();
  isLegal = controlLegallity();
  controlAmountForcePowers();
}

function updateLevel() {

  document.getElementById("illegal_points_1").style.display = "none";
  document.getElementById("illegal_powers_1").style.display = "none";
  document.getElementById("illegal_profs_1").style.display = "none";
  document.getElementById("illegal_saber_1").style.display = "none";
  document.getElementById("illegal_heavy_1").style.display = "none";

  const selectedRank = rankSelect.value;
  const selectedLevel = levelSelect.value;
  const levelHP = rankLevelsMap[selectedRank][selectedLevel][1];
  const conModifier = player[0][2];
  
  const availablePowers = rankLevelsMap[selectedRank][selectedLevel][2]

  if (!isNaN(conModifier)) {
    player[1][0] = 4 * (levelHP + conModifier);
  } else {
    player[1][0] = 4 * (levelHP - 1);
  }

  player[4][1] = availablePowers;

  player[6][1] = rankLevelsMap[selectedRank][selectedLevel][0];

  if(player[6][0] > player[6][1]) {
    whyIllegal[0] = 1;
  } else {
    whyIllegal[0] = 0;
  }

  if(isLegal) {
    document.getElementById("illegal_1").style.display = "none";
  } else {
    document.getElementById("illegal_1").style.display = "block";
    
    whyIllegal[0] ? document.getElementById("illegal_points_1").style.display = "block" : document.getElementById("illegal_points_1").style.display = "none";
    whyIllegal[1] ? document.getElementById("illegal_powers_1").style.display = "block" : document.getElementById("illegal_powers_1").style.display = "none";
    whyIllegal[2] ? document.getElementById("illegal_powrank_1").style.display = "block" : document.getElementById("illegal_powrank_1").style.display = "none";
    whyIllegal[3] ? document.getElementById("illegal_profs_1").style.display = "block" : document.getElementById("illegal_profs_1").style.display = "none";
    whyIllegal[4] ? document.getElementById("illegal_saber_1").style.display = "block" : document.getElementById("illegal_saber_1").style.display = "none";
    whyIllegal[5] ? document.getElementById("illegal_heavy_1").style.display = "block" : document.getElementById("illegal_heavy_1").style.display = "none";
  }
  setSpecies();
  controlAmountForcePowers();
}


function controlAmountForcePowers() {
  var checkboxes = document.getElementsByName("power_user_1");
  var count = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      count++;
    }
  }
  
  player[4][0] = count;

  player[4][0] > player[4][1] ? whyIllegal[1] = 1 : whyIllegal[1] = 0;

  document.getElementById("HP_1").textContent = player[1][0];
  document.getElementById("available_powers_1").textContent = player[4][1];
  document.getElementById("chosen_powers_1").textContent = player[4][0];

  isLegal = controlLegallity();

  console.log(player[4][0] + " /// " + player[4][1]);
}
// Add event listeners to the rank and level select elements
rankSelect.addEventListener("change", updateLevelOptions);
levelSelect.addEventListener("change", updateLevel);

// Call updateLevelOptions on initial page load
updateLevelOptions();




function controlLegallity() {
  for(let i = 0; i < whyIllegal.length; i++) {
    if(whyIllegal[i] > 0) {
      return false;
    }
  }
  return true;
}

function setSpecies() {
  document.getElementById("pro_bonus1_li").style.display = "none";
  document.getElementById("str_bonus1_li").style.display = "none";
  document.getElementById("dex_bonus1_li").style.display = "none";
  document.getElementById("con_bonus1_li").style.display = "none";
  document.getElementById("int_bonus1_li").style.display = "none";
  document.getElementById("wil_bonus1_li").style.display = "none";
  document.getElementById("cha_bonus1_li").style.display = "none";
  document.getElementById("pow_bonus1_li").style.display = "none";
  // Species: 0 - Human / 1 - Cathar / 2 - Chiss / 3 - Cyborg / 4 - Echani / 5 - Miraluka / 6 - Mirialan / 7 - Rattataki / 8 - Sith Pureblood / 9 - Togruta / 10 - Twi'lek / 11 - Zabrak
  // Bonuses: +1 STR / +1 DEX / +1 CON / +1 INT / +1 WIL / +1 CHA / +1 Prof / +1 Power / + 1 Stat
  switch(player[2][0]) {
    case 0:
      //+1 Prof
      document.getElementById("pro_bonus1_li").style.display = "inline";
      //+1 Stat
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("dex_bonus1_li").style.display = "inline";
      document.getElementById("con_bonus1_li").style.display = "inline";
      document.getElementById("int_bonus1_li").style.display = "inline";
      document.getElementById("wil_bonus1_li").style.display = "inline";
      document.getElementById("cha_bonus1_li").style.display = "inline";
      break;
    case 1:
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("dex_bonus1_li").style.display = "inline";
      break;
    case 2:
      break;
    case 3:
      //+1 CON or +1 INT or +1 STR
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("con_bonus1_li").style.display = "inline";
      document.getElementById("int_bonus1_li").style.display = "inline";
      break;
    case 4:
      //+1 STR or +1 CON
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("con_bonus1_li").style.display = "inline";
      break;
    case 5:
      //+1 WIL
      document.getElementById("wil_bonus1_li").style.display = "inline";
      break;
    case 6:
      //+1 WILL or +1 CON
      document.getElementById("con_bonus1_li").style.display = "inline";
      document.getElementById("wil_bonus1_li").style.display = "inline";
      //+1 Prof
      document.getElementById("prof_bonus1_li").style.display = "inline";
      break
    case 7:
      //+1 STR or +1 CON
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("con_bonus1_li").style.display = "inline";
      break;
    case 8:
      //+1 INT or +1 WILL or +1 Force Power
      document.getElementById("int_bonus1_li").style.display = "inline";
      document.getElementById("wil_bonus1_li").style.display = "inline";
      document.getElementById("pow_bonus1_li").style.display = "inline";
      break;
    case 9:
      //+1 WIL or +1 CON
      document.getElementById("con_bonus1_li").style.display = "inline";
      document.getElementById("wil_bonus1_li").style.display = "inline";
      //+1 Prof
      document.getElementById("prof_bonus1_li").style.display = "inline";
      break;
    case 10:
      //+1 CHA or +1 CON
      document.getElementById("con_bonus1_li").style.display = "inline";
      document.getElementById("cha_bonus1_li").style.display = "inline";
      break;
    case 11:
      //+1 STR or +1 DEX or +1 CON
      document.getElementById("str_bonus1_li").style.display = "inline";
      document.getElementById("dex_bonus1_li").style.display = "inline";
      document.getElementById("con_bonus1_li").style.display = "inline";
      break;
    default:
      player[2][0] = 0;
      setSpecies();
  }
}

controlAmountForcePowers();