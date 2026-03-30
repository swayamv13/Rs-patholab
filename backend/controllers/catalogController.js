import labTestModel from '../models/LabTest.js';

const mapItem = (doc) => {
    const d = doc.toObject ? doc.toObject() : { ...doc };
    const id = String(d._id);
    const orig = d.originalPrice || 0;
    const disc = d.discountedPrice ?? orig;
    const discount =
        d.discount ??
        (orig > 0 ? Math.min(99, Math.round((1 - disc / orig) * 100)) : 0);
    return {
        id,
        _id: id,
        name: d.name,
        originalPrice: orig,
        discountedPrice: disc,
        discount,
        categorySlug: d.categorySlug,
        categoryLabel: d.categoryLabel || d.categorySlug,
        kind: d.kind,
        details: d.details || [],
        description: d.description || '',
        link: `/book/${id}`
    };
};

export const getPublicCatalog = async (_req, res) => {
    try {
        const items = await labTestModel
            .find({ active: true })
            .sort({ categorySlug: 1, name: 1 })
            .lean();
        res.json({ success: true, items: items.map(mapItem) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminListTests = async (_req, res) => {
    try {
        const items = await labTestModel.find({}).sort({ updatedAt: -1 }).lean();
        res.json({ success: true, items: items.map(mapItem) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminCreateTest = async (req, res) => {
    try {
        const {
            name,
            categorySlug,
            categoryLabel,
            kind,
            originalPrice,
            discountedPrice,
            discount,
            details,
            description,
            active
        } = req.body;
        if (!name || !categorySlug || originalPrice == null || discountedPrice == null) {
            return res.json({ success: false, message: 'name, categorySlug, originalPrice and discountedPrice are required' });
        }
        const orig = Number(originalPrice);
        const disc = Number(discountedPrice);
        const discPct =
            discount != null
                ? Number(discount)
                : orig > 0
                  ? Math.round((1 - disc / orig) * 100)
                  : 0;
        const doc = await labTestModel.create({
            name: name.trim(),
            categorySlug: String(categorySlug).trim().toLowerCase(),
            categoryLabel: (categoryLabel || categorySlug || '').trim(),
            kind: kind || 'pathology',
            originalPrice: orig,
            discountedPrice: disc,
            discount: discPct,
            details: Array.isArray(details) ? details : [],
            description: description || '',
            active: active !== false
        });
        res.json({ success: true, item: mapItem(doc) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminUpdateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (updates.originalPrice != null) updates.originalPrice = Number(updates.originalPrice);
        if (updates.discountedPrice != null) updates.discountedPrice = Number(updates.discountedPrice);
        if (updates.categorySlug) updates.categorySlug = String(updates.categorySlug).trim().toLowerCase();
        if (updates.name) updates.name = updates.name.trim();
        if (updates.discount == null && updates.originalPrice != null && updates.discountedPrice != null) {
            const o = updates.originalPrice;
            const d = updates.discountedPrice;
            updates.discount = o > 0 ? Math.round((1 - d / o) * 100) : 0;
        }
        const doc = await labTestModel.findByIdAndUpdate(id, updates, { new: true });
        if (!doc) return res.json({ success: false, message: 'Test not found' });
        res.json({ success: true, item: mapItem(doc) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminDeleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        await labTestModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminSeedDefaults = async (req, res) => {
    try {
        const { replaceAll } = req.body || {};
        if (replaceAll) await labTestModel.deleteMany({});
        const count = await labTestModel.countDocuments();
        if (count > 0 && !replaceAll) {
            return res.json({
                success: false,
                message: `Catalog already has ${count} items. Send { "replaceAll": true } to wipe and re-seed, or add tests manually.`
            });
        }
        const { buildDefaultCatalogItems } = await import('../data/buildDefaultCatalog.js');
        const items = buildDefaultCatalogItems();
        await labTestModel.insertMany(items);
        res.json({ success: true, message: `Seeded ${items.length} tests/scans/packages.` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
