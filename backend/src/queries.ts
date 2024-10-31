

export function  getQuestionAndAttemptsByIdQuery() {
    return "SELECT q.*, a.id as attempt_id, a.date, a.time_taken, a.performance, a.suggested_wait_duration FROM questions q INNER JOIN attempts as a ON q.id = a.question_id WHERE q.id = $1"
}