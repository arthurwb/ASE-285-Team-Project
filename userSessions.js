const userSessions = {
    "filterUserTasks": function filterUserTasks(tasks, session) {
        console.log("filterUserTasks: " + tasks[0].user);
        const userTasks = []
        tasks.forEach(task => {
            if (task.user == session.user) {
                userTasks.push(task);
            }
        });
        return userTasks;
    }
}

module.exports = userSessions;