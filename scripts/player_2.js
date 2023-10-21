document.addEventListener("DOMContentLoaded", function() {
    // Get the rank and level select elements
    const rankSelect = document.getElementById("rank_2");
    const levelSelect = document.getElementById("level_2");
  
    // Define the level options for each rank
    const levelOptions = {
      aco: ["I", "II", "III", "IV", "V"],
      neo: ["I", "II", "III"],
      app: ["I", "II", "III", "IV", "V"],
      lor: ["I", "II", "III", "IV", "V"],
      dar: ["I", "II", "III"],
    };
  
    // Function to update the level select options based on the selected rank
    function updateLevelOptions() {
      const selectedRank = rankSelect.value;
      const levels = levelOptions[selectedRank];
  
      // Clear previous level options
      levelSelect.innerHTML = "";
  
      // Create new level options based on the selected rank
      levels.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.text = level;
        levelSelect.appendChild(option);
      });
    }

    rankSelect.addEventListener("change", updateLevelOptions);
  
    // Initial update of level options based on the default rank selection
    updateLevelOptions();
  });
  