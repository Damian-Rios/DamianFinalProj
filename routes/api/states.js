const express = require("express");
const router = express.Router();
const stateController = require("../../controller/stateController");
const verifyStateParameter = require("../../middleware/verifyStateParameter");

// Middleware to verify state code is correct
router.use("/:state", verifyStateParameter);

// Route to get state data by code
router.get('/:state', stateController.GetStateByCode);

// Route to get a random fun fact for a specific state
router.get('/:state/funfact', stateController.GetRandomFunFact);

// Route to get the capital city of a specific state
router.get('/:state/capital', stateController.GetCapitalCity);

// Route to get the nickname of a specific state
router.get('/:state/nickname', stateController.GetStateNickname);

// Route to get the population of a specific state
router.get('/:state/population', stateController.GetPopulation);

// Route to get the admission date of a specific state
router.get('/:state/admission', stateController.GetAdmissionDate);

// Route to add fun facts to a specific state
router.post('/:state/funfact', stateController.AddFunFacts);

// Route to update a specific fun fact for a state
router.patch('/:state/funfact', stateController.UpdateFunFact);

// Route to delete a specific fun fact for a state
router.delete('/:state/funfact', stateController.DeleteFunFact);

// Route to get all states or contiguous states based on the 'contig' query parameter
router.get('/', (req, res, next) => {
    const { contig } = req.query;
    if (contig === 'true') {
      return stateController.GetContiguousStates(req, res, next);
    } else if (contig === 'false') {
      return stateController.GetNonContiguousStates(req, res, next);
    } else {
      return stateController.GetAllStates(req, res, next);
    }
  });

module.exports = router;
