const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { num_range } = this.entities;

    this.on('getNextNumber', async (req) => {
        const { OBJECT_ID } = req.data;

        // Fetch number range for the given OBJECT_ID
        const [range] = await cds.run(
            SELECT.from(num_range).where({ OBJECT_ID })
        );

        // Check if range exists
        if (!range) {
            return req.error(400, `No range found for ${OBJECT_ID}`);
        }

        let currentSeq;

        // Initialize from range_from if current_seq is empty
        if (range.current_seq == null) {
            currentSeq = range.range_from;
        } else {
            currentSeq = range.current_seq + 1;
        }

        // Validate range
        if (currentSeq > range.range_to) {
            return req.error(400, `${OBJECT_ID} range exceeded!`);
        }

        // Update current sequence in DB (atomic for safety)
        await cds.run(
            UPDATE(num_range)
                .set({ current_seq: currentSeq })
                .where({ OBJECT_ID })
        );

        // Generate ID format: YYYYMM + 4-digit sequence
        const now = new Date();
        const yearMonth =
            now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0');

        const newId = `${yearMonth}${String(currentSeq).padStart(4, '0')}`;

        // Return in OData function format
        return { value: newId };
    });
});
