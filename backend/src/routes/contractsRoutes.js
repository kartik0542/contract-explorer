import express from "express";
import {
  createContract,
  deleteContract,
  getAllContracts,
  getContractById,
  updateContract,
} from "../controllers/contractController.js";

const router = express.Router();

router.post("/", createContract); // POST /api/contracts
router.put("/:id", updateContract); // PUT /api/contracts/:id
router.delete("/:id", deleteContract); // DELETE /api/contracts/:id
router.get("/", getAllContracts); // GET /api/contracts
router.get("/:id", getContractById); // GET /api/contracts/:id

export default router;
