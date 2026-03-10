import Contract from "../models/Contract.js";
import Page from "../models/Page.js";

// POST /api/contracts — naya contract banao
export const createContract = async (req, res) => {
  try {
    const { name, contractType, amount, description, status } = req.body;

    if (!name || !contractType || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, contractType and amount are required",
      });
    }

    const contract = await Contract.create({
      name,
      contractType,
      amount,
      description,
      status,
    });
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    // Mongoose validation error (wrong enum value etc.)
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/contracts/:id - contract update karo
export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/contracts/:id - contract delete karo
export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contract deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/contracts - sabhi contracts lao (with dynamic filters)
export const getAllContracts = async (req, res) => {
  try {
    const { pageId, contractType, status, minAmount, maxAmount } = req.query;

    let query = {};

    // Step 1: Agar pageId chhe to Page thi filter lavo
    if (pageId) {
      const page = await Page.findById(pageId);
      if (!page) {
        return res
          .status(404)
          .json({ success: false, message: "Page not found" });
      }

      // Page ke filters query mein apply karo
      const pageFilters = page.filters || {};

      if (pageFilters.contractType?.length > 0) {
        query.contractType = { $in: pageFilters.contractType };
      }
      if (pageFilters.status?.length > 0) {
        query.status = { $in: pageFilters.status };
      }
    }

    // Step 2: User ke filters page filters ko override karenge
    if (contractType) {
      query.contractType = { $in: contractType.split(",") };
    }
    if (status) {
      query.status = { $in: status.split(",") };
    }
    if (minAmount) {
      query.amount = { ...query.amount, $gte: Number(minAmount) };
    }
    if (maxAmount) {
      query.amount = { ...query.amount, $lte: Number(maxAmount) };
    }

    const contracts = await Contract.find(query).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: contracts.length, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/contracts/:id - ek contract lao ID se
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ### Poora flow ek nazar mein:
// ```
// Request aaya (id + new data)
//         ↓
// MongoDB mein ID se dhundha
//         ↓
//     Mila?
//    ↙      ↘
// Nahi       Haan
//   ↓          ↓
// 404        Update karo
//          (validators bhi chalao)
//               ↓
//          Naya document
//          wapas bhejo (200)

// ### Poora flow:
// ```
// DELETE request aaya (id)
//         ↓
// MongoDB mein ID se dhundha
//         ↓
//     Mila?
//    ↙      ↘
// Nahi       Haan
//   ↓          ↓
// 404        Delete karo
//              ↓
//          Success message
//          bhejo (200)
