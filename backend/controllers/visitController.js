import homeVisitModel from '../models/HomeVisit.js';

// Request Home Visit
const requestHomeVisit = async (req, res) => {
    try {
        const { name, phone, city } = req.body;

        if (!name || !phone || !city) {
            return res.json({ success: false, message: 'Data Missing' });
        }

        const visitData = {
            name,
            phone,
            city,
            status: 'pending'
        };

        const newVisit = new homeVisitModel(visitData);
        await newVisit.save();

        res.json({ success: true, message: 'Home Visit Requested Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { requestHomeVisit };
