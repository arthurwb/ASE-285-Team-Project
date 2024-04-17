const userSessions = {
    "filterUserTasks": function filterUserTasks(tasks, session) {
        const userTasks = []
        tasks.forEach(task => {
            if (task.username == session.username) {
                userTasks.push(task);
            }
        });
        return userTasks;
    }
}

module.exports = userSessions;