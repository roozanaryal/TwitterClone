import AdBanner from "../models/adBanner.model.js";

// Get current ad banner configuration
export const getAdBanner = async (req, res) => {
  try {
    let adBanner = await AdBanner.findOne();
    
    // If no ad banner exists, create default one
    if (!adBanner) {
      adBanner = new AdBanner();
      await adBanner.save();
    }
    
    res.status(200).json(adBanner);
  } catch (error) {
    console.error("Error in getAdBanner controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update ad banner configuration (Admin only)
export const updateAdBanner = async (req, res) => {
  try {
    const {
      isActive,
      title,
      subtitle,
      description,
      price,
      imageUrl,
      logoText,
      ctaText,
      ctaUrl,
      backgroundColor,
      textColor,
      showDelay,
      closeDelay
    } = req.body;

    let adBanner = await AdBanner.findOne();
    
    if (!adBanner) {
      adBanner = new AdBanner();
    }

    // Update fields if provided
    if (isActive !== undefined) adBanner.isActive = isActive;
    if (title) adBanner.title = title;
    if (subtitle) adBanner.subtitle = subtitle;
    if (description) adBanner.description = description;
    if (price) adBanner.price = price;
    if (imageUrl) adBanner.imageUrl = imageUrl;
    if (logoText) adBanner.logoText = logoText;
    if (ctaText) adBanner.ctaText = ctaText;
    if (ctaUrl) adBanner.ctaUrl = ctaUrl;
    if (backgroundColor) adBanner.backgroundColor = backgroundColor;
    if (textColor) adBanner.textColor = textColor;
    if (showDelay !== undefined) adBanner.showDelay = showDelay;
    if (closeDelay !== undefined) adBanner.closeDelay = closeDelay;

    await adBanner.save();
    
    res.status(200).json({ 
      message: "Ad banner updated successfully",
      adBanner 
    });
  } catch (error) {
    console.error("Error in updateAdBanner controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset ad banner to default values (Admin only)
export const resetAdBanner = async (req, res) => {
  try {
    await AdBanner.deleteMany({});
    const defaultAdBanner = new AdBanner();
    await defaultAdBanner.save();
    
    res.status(200).json({ 
      message: "Ad banner reset to default values",
      adBanner: defaultAdBanner 
    });
  } catch (error) {
    console.error("Error in resetAdBanner controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
