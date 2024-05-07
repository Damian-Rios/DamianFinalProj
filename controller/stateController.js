const errorHandler = require("../middleware/errorHandler");
const State = require("../model/State");
const statesData = require("../model/states.json");

// Function to get all state data merged with fun facts
const GetAllStates = async (req, res) => {
    try {
      // Fetch all states from the database
      const statesFromDB = await State.find();
  
      // Merge states data from JSON file with fun facts from database
      const statesWithFunFacts = statesData.map(state => {
        const stateFromDB = statesFromDB.find(dbState => dbState.stateCode === state.code);
        const funFacts = stateFromDB ? stateFromDB.funFacts : [];
        return { ...state, funFacts };
      });
      
      res.json(statesWithFunFacts);
    } catch (error) {
      next(error);
    }
};

// Function to get state data for contiguous states (excluding AK and HI)
const GetContiguousStates = async (req, res) => {
    try {
      // Fetch all states from the database
      const statesFromDB = await State.find();
  
      // Filter contiguous states data from JSON file
      const contiguousStates = statesData.filter(state => !["AK", "HI"].includes(state.code));
  
      // Merge contiguous states data with fun facts from database
      const contiguousStatesWithFunFacts = contiguousStates.map(state => {
        const stateFromDB = statesFromDB.find(dbState => dbState.stateCode === state.code);
        const funFacts = stateFromDB ? stateFromDB.funFacts : [];
        return { ...state, funFacts };
      });
  
      res.json(contiguousStatesWithFunFacts);
    } catch (error) {
      next(error);
    }
};

// Function to get state data for non-contiguous states (AK and HI)
const GetNonContiguousStates = async (req, res) => {
    try {
      // Fetch all states from the database
      const statesFromDB = await State.find();
  
      // Filter non-contiguous states data from JSON file
      const nonContiguousStates = statesData.filter(state => ["AK", "HI"].includes(state.code));
  
      // Merge non-contiguous states data with fun facts from database
      const nonContiguousStatesWithFunFacts = nonContiguousStates.map(state => {
        const stateFromDB = statesFromDB.find(dbState => dbState.stateCode === state.code);
        const funFacts = stateFromDB ? stateFromDB.funFacts : [];
        return { ...state, funFacts };
      });
  
      res.json(nonContiguousStatesWithFunFacts);
    } catch (error) {
      next(error);
    }
};  

// Function to get data for a specific state
const GetStateByCode = async (req, res) => {
    let { state } = req.params;
    state = state.toUpperCase();

    try {
        // Fetch state data from the database
        const stateFromDB = await State.findOne({ stateCode: state });

        // Find state data from JSON file
        const stateData = statesData.find(s => s.code === state);

        if (!stateData) {
            return res.status(404).json({ error: "State data not found" });
        }

        // If state data is not found in the database, return data from JSON file
        if (!stateFromDB) {
            const stateWithoutFunFacts = { ...stateData, funFacts: [] };
            return res.json(stateWithoutFunFacts);
        }

        // Merge state data with fun facts from database
        const stateWithFunFacts = {
            ...stateData,
            funFacts: stateFromDB.funFacts || []
        };

        res.json(stateWithFunFacts);
    } catch (error) {
        next(error);
    }
};

// Function to get a random fun fact for a specific state
const GetRandomFunFact = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    try {

      // Find state data from JSON file
      const stateData = statesData.find(state => state.code === stateCode);

      // Fetch state from the database
      const stateFromDB = await State.findOne({ stateCode });
  
      // Get random fun fact
      const randomFact = stateFromDB ? stateFromDB.funFacts[Math.floor(Math.random() * stateFromDB.funFacts.length)] : null;

      // If no fun facts are available for the state, return a custom message
      if (!randomFact) {
        return res.json({ message: `No fun facts found for ${stateData.state}!` });
      }
  
      res.json({ funFact: randomFact });
    } catch (error) {
      next(error);
    }
};

// Function to get the capital city of a specific state
const GetCapitalCity = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    try {
        // Find state data from JSON file
        const stateData = statesData.find(state => state.code === stateCode);
        if (!stateData) {
            return res.status(404).json({ error: "State not found" });
        }

        res.json({ state: stateData.state, capital: stateData.capital_city });
    } catch (error) {
        next(error);
    }
};
  
// Function to get the nickname of a specific state
const GetStateNickname = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    try {
        // Find state data from JSON file
        const stateData = statesData.find(state => state.code === stateCode);
        if (!stateData) {
            return res.status(404).json({ error: "State not found" });
        }

        res.json({ state: stateData.state, nickname: stateData.nickname });
    } catch (error) {
        next(error);
    }
};
  
// Function to get the population of a specific state
const GetPopulation = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    try {
        // Find state data from JSON file
        const stateData = statesData.find(state => state.code === stateCode);

        if (!stateData) {
            return res.status(404).json({ error: "State not found" });
        }

        res.json({ state: stateData.state, population: stateData.population });
    } catch (error) {
        next(error);
    }
};
  
// Function to get the admission date of a specific state
const GetAdmissionDate = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    try {
        // Find state data from JSON file
        const stateData = statesData.find(state => state.code === stateCode);

        if (!stateData) {
            return res.status(404).json({ error: "State not found" });
        }

        res.json({ state: stateData.state, admitted: stateData.admission_date });
    } catch (error) {
        next(error);
    }
};  

const AddFunFacts = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    const { funfacts } = req.body;

    try {
        // Ensure funfacts property is provided and is an array
        if (!Array.isArray(funfacts)) {
            return res.status(400).json({ error: "The 'funfacts' property must be an array." });
        }

        let state = await State.findOne({ stateCode });

        if (!state) {
            state = new State({
                stateCode,
                funFacts: funfacts
            });
        } else {
            // Merge the existing fun facts array with the new fun facts array
            const mergedFunFacts = new Set([...state.funFacts, ...funfacts]);
            // Convert the Set back to an array
            state.funFacts = Array.from(mergedFunFacts);
        }

        await state.save();
        res.json({ message: "Fun facts added successfully", state });
    } catch (error) {
        next(error);
    }
};

  // Function to update a specific fun fact for a state
const UpdateFunFact = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    const { index, funfact } = req.body;

    try {
      let state = await State.findOne({ stateCode });
      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }
      if (!index || index <= 0 || index > state.funFacts.length) {
        return res.status(400).json({ error: "Invalid index" });
      }
      state.funFacts[index - 1] = funfact;
      await state.save();
      res.json({ message: "Fun fact updated successfully", state });
    } catch (error) {
        next(error);
    }
  };

  // Function to delete a specific fun fact for a state
const DeleteFunFact = async (req, res) => {
    let stateCode = req.params.state;
    stateCode = stateCode.toUpperCase();

    const { index } = req.body;

    try {
      let state = await State.findOne({ stateCode });
      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }
      if (!index || index <= 0 || index > state.funFacts.length) {
        return res.status(400).json({ error: "Invalid index" });
      }

      const adjustedIndex = index -1;

      state.funFacts = state.funFacts.filter((_, idx) => idx !== adjustedIndex);
      
      await state.save();
      res.json({ message: "Fun fact deleted successfully", state });
    } catch (error) {
        next(error);
    }
  };

module.exports = {
  GetAllStates,
  GetContiguousStates,
  GetNonContiguousStates,
  GetStateByCode,
  GetRandomFunFact,
  GetCapitalCity,
  GetStateNickname,
  GetPopulation,
  GetAdmissionDate,
  AddFunFacts,
  UpdateFunFact,
  DeleteFunFact
};
