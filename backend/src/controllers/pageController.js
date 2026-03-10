import Page from "../models/Page.js";

// POST /api/pages — naya page banao
export const createPage = async (req, res) => {
  try {
    const { title, url, rank, parent, filters } = req.body;

    // required fields check
    if (!title || !url) {
      return res
        .status(400)
        .json({ success: false, message: "Title and URL is required" });
    }

    const page = await Page.create({ title, url, rank, parent, filters });
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    // duplicate URL error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "URL already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

//PUT /api/pages/:id - page update karo
export const updatePage = async (req, res) => {
  try {
    const { url } = req.body;

    // check duplicate url (except current page)
    if (url) {
      const existing = await Page.findOne({
        url,
        _id: { $ne: req.params.id },
      });

      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "URL already exists" });
      }
    }

    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/pages/:id - page delete karo
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/pages - sabhi pages lao (sidebar ke liye)
export const getAllPages = async (req, res) => {
  try {
    const { url } = req.query;

    // agar url query params hai toh sirf woh page lao
    if (url) {
      const page = await Page.find({ url });
      if (!page) {
        return res
          .status(404)
          .json({ success: false, message: "Page Not found" });
      }
      return res.status(200).json({ success: true, data: page });
    }

    // warna sab page lao, rank ke hisab se sort karo
    const pages = await Page.find().sort({ rank: 1 });
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/pages/:id - ek page lao ID se
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res
        .status(500)
        .json({ success: false, message: "Page not found" });
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
