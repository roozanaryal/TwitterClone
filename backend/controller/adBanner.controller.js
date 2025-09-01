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

    // Check if ad should be shown based on scheduling and limits
    const now = new Date();
    const shouldShow = adBanner.isActive && 
                      (!adBanner.isScheduled || (now >= adBanner.startDate && now <= adBanner.endDate)) &&
                      (adBanner.impressions < adBanner.maxImpressions);

    // If ad should be shown, increment impressions
    if (shouldShow && req.query.increment === 'true') {
      adBanner.impressions += 1;
      await adBanner.save();
    }
    
    res.status(200).json({
      ...adBanner.toObject(),
      shouldShow
    });
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
      closeDelay,
      category,
      targetAudience,
      priority,
      startDate,
      endDate,
      maxImpressions,
      isScheduled,
      adminNotes
    } = req.body;

    let adBanner = await AdBanner.findOne();
    
    if (!adBanner) {
      adBanner = new AdBanner();
    }

    // Update basic fields if provided
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

    // Update new dynamic fields
    if (category) adBanner.category = category;
    if (targetAudience) adBanner.targetAudience = targetAudience;
    if (priority !== undefined) adBanner.priority = priority;
    if (startDate) adBanner.startDate = new Date(startDate);
    if (endDate) adBanner.endDate = new Date(endDate);
    if (maxImpressions !== undefined) adBanner.maxImpressions = maxImpressions;
    if (isScheduled !== undefined) adBanner.isScheduled = isScheduled;
    if (adminNotes !== undefined) adBanner.adminNotes = adminNotes;

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

// Track ad banner click (for analytics)
export const trackAdClick = async (req, res) => {
  try {
    const adBanner = await AdBanner.findOne();
    
    if (adBanner) {
      adBanner.clicks += 1;
      await adBanner.save();
    }
    
    res.status(200).json({ 
      message: "Click tracked successfully",
      clicks: adBanner?.clicks || 0
    });
  } catch (error) {
    console.error("Error in trackAdClick controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get ad banner analytics (Admin only)
export const getAdAnalytics = async (req, res) => {
  try {
    const adBanner = await AdBanner.findOne();
    
    if (!adBanner) {
      return res.status(404).json({ error: "No ad banner found" });
    }

    const analytics = {
      impressions: adBanner.impressions,
      clicks: adBanner.clicks,
      clickThroughRate: adBanner.impressions > 0 ? ((adBanner.clicks / adBanner.impressions) * 100).toFixed(2) : 0,
      isActive: adBanner.isActive,
      category: adBanner.category,
      priority: adBanner.priority,
      startDate: adBanner.startDate,
      endDate: adBanner.endDate,
      maxImpressions: adBanner.maxImpressions,
      remainingImpressions: Math.max(0, adBanner.maxImpressions - adBanner.impressions),
      daysRemaining: Math.max(0, Math.ceil((new Date(adBanner.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    };
    
    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error in getAdAnalytics controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle ad banner active status (Admin only)
export const toggleAdStatus = async (req, res) => {
  try {
    const adBanner = await AdBanner.findOne();
    
    if (!adBanner) {
      return res.status(404).json({ error: "No ad banner found" });
    }

    adBanner.isActive = !adBanner.isActive;
    await adBanner.save();
    
    res.status(200).json({ 
      message: `Ad banner ${adBanner.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: adBanner.isActive
    });
  } catch (error) {
    console.error("Error in toggleAdStatus controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
