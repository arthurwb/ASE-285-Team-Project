function calculateTaskVisibility(details) {
    let currentDate = new Date();
    const startDate = new Date(details.recurrence.startBy);
    let endDate = details.recurrence.endBy ? new Date(details.recurrence.endBy) : null;
    let isVisible = true;

    if (details.isRecurring && (currentDate < startDate || (endDate && currentDate >= endDate))) {
        isVisible = false;
    }

    if (details.completions.length > 0) {
        isVisible = false;
        const latestCompletionDate = details.completions.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date;
        let nextDate = new Date(latestCompletionDate);

        const interval = details.recurrence.interval || 1;
        switch (details.recurrence.frequency) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + interval);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7 * interval);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + interval);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + interval);
                break;
        }

        if (currentDate >= nextDate) {
            isVisible = true;
        }
    }

    return isVisible;
}

module.exports = calculateTaskVisibility;